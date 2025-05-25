
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: './uploads/templates',
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    const filename = `${timestamp}-${path.basename(file.originalname, extension)}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Criar diretório de uploads se não existir
const templatesDir = './uploads/templates';
if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Rota para upload de template
router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('Recebendo upload de template...');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Extrair texto do arquivo .docx
    const buffer = fs.readFileSync(file.path);
    const result = await mammoth.convertToHtml({ buffer });
    const htmlContent = result.value;

    // Encontrar campos dinâmicos
    const fieldRegex = /{{([^}]+)}}/g;
    const recognizedFields = [...new Set(htmlContent.match(fieldRegex) || [])];

    // Criar template usando Prisma
    const newTemplate = await prisma.template.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        brand: req.body.brand,
        content: req.body.content || htmlContent,
        recognizedFields: req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields,
        docxUrl: file.path
      }
    });

    console.log('Template criado com sucesso:', newTemplate.id);
    res.json(newTemplate);
  } catch (error) {
    console.error('Erro ao criar template:', error);
    res.status(500).json({ error: 'Erro ao criar template', message: error.message });
  }
});

// Listar templates
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates', message: error.message });
  }
});

// Obter template por ID
router.get('/:id', async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao obter template:', error);
    res.status(500).json({ error: 'Erro ao obter template', message: error.message });
  }
});

// Atualizar template
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    let updateData: any = {
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
    };

    // Se um novo arquivo foi enviado, processar
    if (file) {
      const buffer = fs.readFileSync(file.path);
      const result = await mammoth.convertToHtml({ buffer });
      const htmlContent = result.value;

      const fieldRegex = /{{([^}]+)}}/g;
      const recognizedFields = [...new Set(htmlContent.match(fieldRegex) || [])];

      updateData.content = req.body.content || htmlContent;
      updateData.recognizedFields = req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields;
      updateData.docxUrl = file.path;
    } else if (req.body.content) {
      updateData.content = req.body.content;
    }

    if (req.body.recognizedFields) {
      updateData.recognizedFields = JSON.parse(req.body.recognizedFields);
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: updateData
    });

    res.json(updatedTemplate);
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    res.status(500).json({ error: 'Erro ao atualizar template', message: error.message });
  }
});

// Deletar template
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar template para obter o caminho do arquivo
    const template = await prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    // Deletar arquivo físico se existir
    if (template.docxUrl && fs.existsSync(template.docxUrl)) {
      fs.unlinkSync(template.docxUrl);
    }

    // Deletar do banco de dados
    await prisma.template.delete({
      where: { id }
    });

    res.json({ message: 'Template deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar template:', error);
    res.status(500).json({ error: 'Erro ao deletar template', message: error.message });
  }
});

export default router;

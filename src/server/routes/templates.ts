
import { Router } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const prisma = new PrismaClient();
const router = Router();

// Configurar multer para upload de arquivos
const storage = multer.diskStorage({
  destination: './uploads/templates',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
  }
});

// Criar diretório de uploads se não existir
if (!fs.existsSync('./uploads/templates')) {
  fs.mkdirSync('./uploads/templates', { recursive: true });
}

// Rota para upload de template
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Extrair texto do arquivo .docx
    const buffer = fs.readFileSync(file.path);
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    // Encontrar campos dinâmicos
    const fieldRegex = /{{([^}]+)}}/g;
    const recognizedFields = [...new Set(text.match(fieldRegex) || [])];

    // Criar template no banco
    const template = await prisma.template.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        brand: req.body.brand,
        recognizedFields,
        docxUrl: file.path
      }
    });

    res.json(template);
  } catch (error) {
    console.error('Erro ao criar template:', error);
    res.status(500).json({ error: 'Erro ao criar template' });
  }
});

// Listar templates
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.template.findMany();
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates' });
  }
});

export default router;

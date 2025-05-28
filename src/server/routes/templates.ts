import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFService } from '../services/pdf';
import { DocxParser } from '../utils/docx-parser';

const router = Router();

const templateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'templates');

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}_${sanitizedName}`);
  }
});

const upload = multer({ 
  storage: templateStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.docx', '.pdf'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos .docx e .pdf são permitidos'), false);
    }
  }
});

// Upload template file
router.post('/upload', upload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
    }

    const { name, description, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Nome e tipo são obrigatórios' });
    }

    // Read file content for processing
    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    let processedContent = '';

    if (fileExtension === '.docx') {
      // Process DOCX file
      const data = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: data });
      processedContent = result.value;
    } else if (fileExtension === '.pdf') {
      // For PDF files, we'll store the path for now
      processedContent = `PDF file: ${req.file.filename}`;
    }

    // Create database entry
    const template = await req.prisma.template.create({
      data: {
        name,
        description: description || '',
        type,
        filePath: req.file.filename,
        fileType: fileExtension.replace('.', ''),
        content: processedContent,
        variables: [], // Will be extracted later
        createdBy: req.user?.id || 'system'
      }
    });

    res.json({
      success: true,
      template,
      message: 'Template enviado com sucesso'
    });

  } catch (error) {
    console.error('Error uploading template:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get all templates
router.get('/', async (req, res) => {
  try {
    const templates = await req.prisma.template.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Erro ao buscar templates' });
  }
});

// Get template by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const template = await req.prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Erro ao buscar template' });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const template = await req.prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'uploads', 'templates', template.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await req.prisma.template.delete({
      where: { id }
    });

    res.json({ message: 'Template deletado com sucesso' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ error: 'Erro ao deletar template' });
  }
});

// Generate document from template
router.post('/:id/generate', async (req, res) => {
  try {
    const { id } = req.params;
    const { variables, caseId } = req.body;

    const template = await req.prisma.template.findUnique({
      where: { id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    const filePath = path.join(process.cwd(), 'uploads', 'templates', template.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo do template não encontrado' });
    }

    if (template.fileType === 'docx') {
      // Read the DOCX template
      const content = fs.readFileSync(filePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Set the template variables
      doc.setData(variables || {});

      try {
        // Render the document
        doc.render();
      } catch (error) {
        console.error('Template rendering error:', error);
        return res.status(400).json({ error: 'Erro ao processar template' });
      }

      // Generate the output
      const buf = doc.getZip().generate({ type: 'nodebuffer' });

      // Save generated document
      const outputFileName = `generated_${Date.now()}_${template.name}.docx`;
      const outputPath = path.join(process.cwd(), 'uploads', 'generated', outputFileName);

      // Ensure directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      fs.writeFileSync(outputPath, buf);

      // Save generation record
      const generatedDoc = await req.prisma.document.create({
        data: {
          templateId: template.id,
          caseId: caseId || null,
          filePath: outputFileName,
          variables: JSON.stringify(variables),
          generatedBy: req.user?.id || 'system'
        }
      });

      res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.send(buf);
    } else {
      console.warn('A geração de documentos PDF ainda não é suportada.');
      res.status(501).json({ error: 'A geração de documentos PDF ainda não é suportada.' });
    }
  } catch (error) {
    console.error('Erro ao gerar documento:', error);
    res.status(500).json({ error: 'Erro ao gerar documento' });
  }
});

export default router;
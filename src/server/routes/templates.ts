import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFService } from '../services/pdf';
import { DocxParser } from '../utils/docx-parser';

const router = Router();

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

// Mock database (arquivo JSON)
const dbFile = './uploads/templates/templates.json';

const loadTemplates = () => {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
  }
  return [];
};

const saveTemplates = (templates: any[]) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Erro ao salvar templates:', error);
  }
};

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

    // Criar template
    const templates = loadTemplates();
    const newTemplate = {
      id: Date.now().toString(),
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
      content: req.body.content || htmlContent,
      recognizedFields: req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields,
      docxUrl: file.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templates.push(newTemplate);
    saveTemplates(templates);

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
    const templates = loadTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates', message: error.message });
  }
});

// Obter template por ID
router.get('/:id', async (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao obter template:', error);
    res.status(500).json({ error: 'Erro ao obter template', message: error.message });
  }
});

export default router;
```

```
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFService } from '../services/pdf';
import { DocxParser } from '../utils/docx-parser';

const router = Router();

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

// Mock database (arquivo JSON)
const dbFile = './uploads/templates/templates.json';

const loadTemplates = () => {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
  }
  return [];
};

const saveTemplates = (templates: any[]) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Erro ao salvar templates:', error);
  }
};

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

    // Criar template
    const templates = loadTemplates();
    const newTemplate = {
      id: Date.now().toString(),
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
      content: req.body.content || htmlContent,
      recognizedFields: req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields,
      docxUrl: file.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templates.push(newTemplate);
    saveTemplates(templates);

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
    const templates = loadTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates', message: error.message });
  }
});

// Obter template por ID
router.get('/:id', async (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao obter template:', error);
    res.status(500).json({ error: 'Erro ao obter template', message: error.message });
  }
});

export default router;
```

The provided changes only add imports for `PDFService` and `DocxParser`. Applying these changes results in the following complete code:

```
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFService } from '../services/pdf';
import { DocxParser } from '../utils/docx-parser';

const router = Router();

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

// Mock database (arquivo JSON)
const dbFile = './uploads/templates/templates.json';

const loadTemplates = () => {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
  }
  return [];
};

const saveTemplates = (templates: any[]) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Erro ao salvar templates:', error);
  }
};

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

    // Criar template
    const templates = loadTemplates();
    const newTemplate = {
      id: Date.now().toString(),
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
      content: req.body.content || htmlContent,
      recognizedFields: req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields,
      docxUrl: file.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templates.push(newTemplate);
    saveTemplates(templates);

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
    const templates = loadTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates', message: error.message });
  }
});

// Obter template por ID
router.get('/:id', async (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao obter template:', error);
    res.status(500).json({ error: 'Erro ao obter template', message: error.message });
  }
});

export default router;
```

```
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFService } from '../services/pdf';
import { DocxParser } from '../utils/docx-parser';

const router = Router();

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

// Mock database (arquivo JSON)
const dbFile = './uploads/templates/templates.json';

const loadTemplates = () => {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
  }
  return [];
};

const saveTemplates = (templates: any[]) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Erro ao salvar templates:', error);
  }
};

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

    // Criar template
    const templates = loadTemplates();
    const newTemplate = {
      id: Date.now().toString(),
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
      content: req.body.content || htmlContent,
      recognizedFields: req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields,
      docxUrl: file.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templates.push(newTemplate);
    saveTemplates(templates);

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
    const templates = loadTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates', message: error.message });
  }
});

// Obter template por ID
router.get('/:id', async (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao obter template:', error);
    res.status(500).json({ error: 'Erro ao obter template', message: error.message });
  }
});

export default router;
```

```
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { PDFService } from '../services/pdf';
import { DocxParser } from '../utils/docx-parser';

const router = Router();

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

// Mock database (arquivo JSON)
const dbFile = './uploads/templates/templates.json';

const loadTemplates = () => {
  try {
    if (fs.existsSync(dbFile)) {
      const data = fs.readFileSync(dbFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erro ao carregar templates:', error);
  }
  return [];
};

const saveTemplates = (templates: any[]) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(templates, null, 2));
  } catch (error) {
    console.error('Erro ao salvar templates:', error);
  }
};

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

    // Criar template
    const templates = loadTemplates();
    const newTemplate = {
      id: Date.now().toString(),
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
      content: req.body.content || htmlContent,
      recognizedFields: req.body.recognizedFields ? JSON.parse(req.body.recognizedFields) : recognizedFields,
      docxUrl: file.path,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    templates.push(newTemplate);
    saveTemplates(templates);

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
    const templates = loadTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ error: 'Erro ao listar templates', message: error.message });
  }
});

// Obter template por ID
router.get('/:id', async (req, res) => {
  try {
    const templates = loadTemplates();
    const template = templates.find(t => t.id === req.params.id);

    if (!template) {
      return res.status(404).json({ error: 'Template não encontrado' });
    }

    res.json(template);
  } catch (error) {
    console.error('Erro ao obter template:', error);
    res.status(500).json({ error: 'Erro ao obter template', message: error.message });
  }
});

export default router;
```

The code imports the necessary modules for PDF generation and docx parsing.
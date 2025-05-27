
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import puppeteer from 'puppeteer';
import { prisma } from '../lib/prisma';

export interface DocumentData {
  [key: string]: any;
}

export class PDFService {
  static async generateFromTemplate(
    templateId: string,
    caseId: string,
    data: DocumentData
  ): Promise<{ success: boolean; pdfPath?: string; error?: string }> {
    try {
      // Buscar template no banco
      const template = await prisma.template.findUnique({
        where: { id: templateId }
      });

      if (!template) {
        return { success: false, error: 'Template não encontrado' };
      }

      const templatePath = path.join(process.cwd(), 'uploads', 'templates', template.fileName);
      
      if (!fs.existsSync(templatePath)) {
        return { success: false, error: 'Arquivo de template não encontrado' };
      }

      // Ler template .docx
      const content = fs.readFileSync(templatePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Substituir variáveis pelos dados do caso
      doc.setData(data);
      doc.render();

      // Gerar buffer do documento
      const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
      });

      // Salvar documento temporário
      const tempDocxPath = path.join(process.cwd(), 'uploads', 'temp', `${caseId}_${Date.now()}.docx`);
      fs.writeFileSync(tempDocxPath, buf);

      // Converter para PDF usando puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      
      // Criar HTML a partir do conteúdo do documento
      const htmlContent = await this.convertDocxToHTML(tempDocxPath, data);
      await page.setContent(htmlContent);
      
      // Gerar PDF
      const pdfFileName = `${caseId}_${template.name}_${Date.now()}.pdf`;
      const pdfPath = path.join(process.cwd(), 'uploads', 'pdfs', pdfFileName);
      
      // Criar diretório se não existir
      const pdfDir = path.dirname(pdfPath);
      if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
      }

      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });

      await browser.close();

      // Limpar arquivo temporário
      fs.unlinkSync(tempDocxPath);

      // Registrar documento gerado no banco
      await prisma.document.create({
        data: {
          caseId,
          templateId,
          fileName: pdfFileName,
          filePath: pdfPath,
          type: 'PDF',
          generatedAt: new Date()
        }
      });

      return { success: true, pdfPath };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }

  private static async convertDocxToHTML(docxPath: string, data: DocumentData): Promise<string> {
    // Template HTML básico para conversão
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 40px;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
          }
          .content { 
            margin-bottom: 20px; 
          }
          .footer { 
            text-align: center; 
            margin-top: 50px; 
            font-size: 12px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Total Brand Protection</h1>
          <h2>${data.documentTitle || 'Documento'}</h2>
        </div>
        
        <div class="content">
          <p><strong>Caso:</strong> ${data.caseId}</p>
          <p><strong>Marca:</strong> ${data.brand}</p>
          <p><strong>Loja:</strong> ${data.store}</p>
          <p><strong>Data:</strong> ${data.date}</p>
          
          <br>
          
          <p>${data.content || 'Conteúdo do documento'}</p>
        </div>
        
        <div class="footer">
          <p>Documento gerado automaticamente pelo sistema TBP</p>
          <p>Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </body>
      </html>
    `;
  }

  static async generateNotification(caseId: string): Promise<{ success: boolean; pdfPath?: string; error?: string }> {
    try {
      // Buscar dados do caso
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        include: {
          brand: true,
          createdBy: true
        }
      });

      if (!caseData) {
        return { success: false, error: 'Caso não encontrado' };
      }

      // Buscar template de notificação padrão
      const template = await prisma.template.findFirst({
        where: { type: 'NOTIFICATION' }
      });

      if (!template) {
        return { success: false, error: 'Template de notificação não encontrado' };
      }

      const documentData = {
        caseId: caseData.id,
        documentTitle: 'Notificação Extrajudicial',
        brand: caseData.brand.name,
        store: caseData.store,
        date: new Date().toLocaleDateString('pt-BR'),
        content: `
          Por meio desta, notificamos que foi identificada a comercialização de produtos que violam os direitos de propriedade intelectual da marca ${caseData.brand.name}.
          
          Solicitamos a retirada imediata dos produtos em questão de seu estabelecimento/plataforma.
          
          Dados do caso:
          - ID: ${caseData.id}
          - Loja: ${caseData.store}
          - Data de identificação: ${caseData.createdAt.toLocaleDateString('pt-BR')}
          
          Aguardamos retorno em até 48 horas.
        `
      };

      return await this.generateFromTemplate(template.id, caseId, documentData);
    } catch (error) {
      console.error('Erro ao gerar notificação:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  }
}

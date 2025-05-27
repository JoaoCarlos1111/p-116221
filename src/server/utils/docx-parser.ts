
import fs from 'fs';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

export interface TemplateField {
  name: string;
  type: 'text' | 'date' | 'number' | 'boolean';
  description?: string;
}

export class DocxParser {
  static extractFields(filePath: string): TemplateField[] {
    try {
      const content = fs.readFileSync(filePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);

      // Extrair texto do documento
      const fullText = doc.getFullText();
      
      // Buscar por placeholders no formato {{campo}}
      const placeholderRegex = /\{\{([^}]+)\}\}/g;
      const fields: TemplateField[] = [];
      const foundFields = new Set<string>();
      
      let match;
      while ((match = placeholderRegex.exec(fullText)) !== null) {
        const fieldName = match[1].trim();
        
        if (!foundFields.has(fieldName)) {
          foundFields.add(fieldName);
          
          // Inferir tipo baseado no nome do campo
          let type: TemplateField['type'] = 'text';
          if (fieldName.toLowerCase().includes('data')) {
            type = 'date';
          } else if (fieldName.toLowerCase().includes('valor') || fieldName.toLowerCase().includes('preco')) {
            type = 'number';
          }
          
          fields.push({
            name: fieldName,
            type,
            description: this.generateFieldDescription(fieldName)
          });
        }
      }
      
      return fields;
    } catch (error) {
      console.error('Erro ao extrair campos do template:', error);
      return [];
    }
  }

  private static generateFieldDescription(fieldName: string): string {
    const descriptions: { [key: string]: string } = {
      'caseId': 'ID do caso',
      'brand': 'Nome da marca',
      'store': 'Nome da loja',
      'date': 'Data atual',
      'clientName': 'Nome do cliente',
      'amount': 'Valor monetário',
      'description': 'Descrição do produto',
      'url': 'URL da loja/produto'
    };

    return descriptions[fieldName] || `Campo: ${fieldName}`;
  }

  static validateTemplate(filePath: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      if (!fs.existsSync(filePath)) {
        errors.push('Arquivo não encontrado');
        return { valid: false, errors };
      }

      const content = fs.readFileSync(filePath, 'binary');
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip);

      // Tentar renderizar com dados de teste
      const testData = { test: 'valor_teste' };
      doc.setData(testData);
      doc.render();

      return { valid: true, errors: [] };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Erro de validação');
      return { valid: false, errors };
    }
  }
}

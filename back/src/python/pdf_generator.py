from pdfrw import PdfReader, PdfWriter, PdfName

def gerar_pdf(template, dados, saida):
    """
    Preenche um PDF template com os dados fornecidos.

    Args:
        template (str): Caminho do PDF modelo.
        dados (dict): Dicionário com os dados para preencher.
        saida (str): Nome do arquivo de saída.
    """
    # Carregar o PDF modelo
    pdf = PdfReader(template)
    
    # Modificar apenas os campos de texto
    for page in pdf.pages:
        annotations = page['/Annots'] if '/Annots' in page else []
        for annotation in annotations:
            if annotation['/Subtype'] == '/Widget' and annotation['/T']:
                campo = annotation['/T'][1:-1]  # Remover parênteses extras
                if campo in dados:
                    annotation.update({
                        PdfName('/V'): dados[campo],
                        PdfName('/Ff'): 1,  # Tornar somente leitura
                    })

    # Salvar o PDF preenchido
    PdfWriter().write(saida, pdf)

# Caminho do arquivo modelo
template_pdf = r"C:\Users\andre\OneDrive\Área de Trabalho\DAFFI APP\app-DAFFI\back\src\python\DIARIO_DE_OBRA_MODELO.pdf"
saida_pdf = "DIARIO_DE_OBRA_PREENCHIDO.pdf"

# Dados de exemplo
dados_exemplo = {
    'data': '02/12/2024',
    'obra': 'MARS ALAMBRADO',
    'responsavel_tecnico': 'Alan Alves dos Santos',
    'endereco': 'Rodovia Presidente Dutra, Estr. do Lambarí, Guararema - SP, 08900-970',
    'clima': 'Operável',
    'mao_de_obra': 'Pedreiro: 1, Ajudante Geral: 2',
    'observacoes': 'Nenhuma irregularidade.',
}

# Gerar o PDF
gerar_pdf(template_pdf, dados_exemplo, saida_pdf)
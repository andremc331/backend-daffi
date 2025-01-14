import sys
import json
from pdf_generator import gerar_pdf

if __name__ == "__main__":
    try:
        # Receber dados JSON como argumento
        dados = json.loads(sys.argv[1])

        # Tentar gerar o PDF com os dados fornecidos
        nome_arquivo = gerar_pdf(dados)

        # Se tudo correr bem, imprime o nome do arquivo gerado
        print(nome_arquivo)
    except ValueError as e:
        # Caso falhe, imprime o erro e encerra o processo
        print(f"Erro: {e}")
        sys.exit(1)
    except Exception as e:
        # Captura qualquer outro erro que possa ocorrer
        print(f"Erro inesperado: {e}")
        sys.exit(1)
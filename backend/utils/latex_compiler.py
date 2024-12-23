# backend/utils/latex_compiler.py

import subprocess
import os
from config import Config

class LaTeXCompiler:
    def __init__(self):
        self.compiler = Config.LATEX_COMPILER
        self.templates_dir = Config.TEMPLATES_DIR
        self.generated_pdf_dir = Config.GENERATED_PDF_DIR
        if not os.path.exists(self.generated_pdf_dir):
            os.makedirs(self.generated_pdf_dir)

    def compile_latex(self, tex_content, output_filename):
        temp_tex_path = os.path.join(self.generated_pdf_dir, f"{output_filename}.tex")
        with open(temp_tex_path, 'w') as tex_file:
            tex_file.write(tex_content)

        try:
            subprocess.run([self.compiler, temp_tex_path],
                           cwd=self.generated_pdf_dir,
                           check=True,
                           stdout=subprocess.PIPE,
                           stderr=subprocess.PIPE)
            pdf_path = os.path.join(self.generated_pdf_dir, f"{output_filename}.pdf")
            if os.path.exists(pdf_path):
                return pdf_path
            else:
                raise FileNotFoundError("PDF was not generated.")
        except subprocess.CalledProcessError as e:
            error_message = e.stderr.decode()
            raise RuntimeError(f"LaTeX compilation failed: {error_message}")
        finally:
            # Clean up temporary .tex and auxiliary files
            for ext in ['.aux', '.log']:
                file_to_remove = os.path.join(self.generated_pdf_dir, f"{output_filename}{ext}")
                if os.path.exists(file_to_remove):
                    os.remove(file_to_remove)

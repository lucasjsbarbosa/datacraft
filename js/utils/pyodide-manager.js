// Gerenciador para ambiente Python via Pyodide
class PyodideManager {
    constructor() {
        this.pyodide = null;
        this.initialized = false;
        this.datasets = {};
        this.initializationPromise = null;
    }
    
    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }
        
        this.initializationPromise = new Promise(async (resolve, reject) => {
            try {
                console.log("Carregando ambiente Python...");
                
                // Carregar Pyodide
                this.pyodide = await loadPyodide();
                
                // Carregar pacotes necessários
                await this.pyodide.loadPackagesFromImports('import numpy as np; import pandas as pd; import matplotlib.pyplot as plt');
                
                // Configuração adicional para matplotlib
                await this.pyodide.runPythonAsync(`
                    import matplotlib
                    matplotlib.use("AGG")
                    
                    # Configurar exibição de pandas
                    import pandas as pd
                    pd.set_option('display.max_rows', 10)
                    pd.set_option('display.max_columns', 10)
                    
                    print("Ambiente Python inicializado com sucesso!")
                `);
                
                this.initialized = true;
                console.log("Pyodide inicializado com sucesso!");
                resolve(this);
            } catch (error) {
                console.error("Erro ao inicializar Pyodide:", error);
                reject(error);
            }
        });
        
        return this.initializationPromise;
    }
    
    async loadDataset(name, csvData) {
        if (!this.initialized) {
            throw new Error("Pyodide não está inicializado");
        }
        
        try {
            // Carregar dataset como DataFrame
            const result = await this.pyodide.runPythonAsync(`
                import pandas as pd
                import io
                
                ${name}_df = pd.read_csv(io.StringIO("""${csvData}"""))
                ${name}_df
            `);
            
            // Armazenar referência ao dataset
            this.datasets[name] = true;
            
            return result;
        } catch (error) {
            console.error(`Erro ao carregar dataset ${name}:`, error);
            throw error;
        }
    }
    
    async runCode(code, taskId = null) {
        if (!this.initialized) {
            throw new Error("Pyodide não está inicializado");
        }
        
        try {
            // Guardar o código para avaliação
            await this.pyodide.runPythonAsync(`
                user_code = """${code}"""
            `);
            
            // Executar código Python
            const result = await this.pyodide.runPythonAsync(code);
            
            // Se há uma tarefa associada, avalia o resultado
            if (taskId && TASKS_DATA[taskId]) {
                const task = TASKS_DATA[taskId];
                
                // Executar avaliação
                if (task.evaluation_code) {
                    const evaluationResult = await this.pyodide.runPythonAsync(`
                        ${task.evaluation_code}
                        
                        # Executar função de avaliação
                        evaluate_solution(${result})
                    `);
                    
                    return evaluationResult;
                }
            }
            
            return {
                success: true,
                result: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Instância global
const pyodideManager = new PyodideManager();
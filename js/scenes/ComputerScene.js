class ComputerScene extends Phaser.Scene {
    constructor() {
        super('ComputerScene');
        this.currentTask = null;
    }
    
    init(data) {
        this.currentTask = data.task || null;
    }
    
    create() {
        // Fundo do "computador"
        this.add.rectangle(0, 0, 800, 600, 0x263238).setOrigin(0);
        
        // Barra superior
        this.add.rectangle(0, 0, 800, 40, 0x37474F).setOrigin(0);
        
        // Título
        let title = "Terminal Python";
        if (this.currentTask) {
            title = this.currentTask.title;
        }
        
        this.add.text(400, 20, title, { 
            font: '18px Arial', 
            fill: '#ffffff' 
        }).setOrigin(0.5, 0.5);
        
        // Botão de fechar
        const closeButton = this.add.text(780, 20, 'X', { 
            font: '18px Arial', 
            fill: '#ffffff',
            backgroundColor: '#c0392b',
            padding: { x: 8, y: 4 }
        }).setOrigin(1, 0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => {
            this.closeComputer();
        });
        
        // Se for uma tarefa específica
        if (this.currentTask) {
            this.setupTaskMode();
        } else {
            this.setupFreeMode();
        }
    }
    
    setupTaskMode() {
        // Descrição da tarefa
        this.add.text(20, 60, 'Tarefa:', { 
            font: '16px Arial', 
            fill: '#4CAF50' 
        });
        
        this.add.text(20, 85, this.currentTask.description, { 
            font: '14px Arial', 
            fill: '#ffffff',
            wordWrap: { width: 760 }
        });
        
        // Objetivo
        this.add.text(20, 130, 'Objetivo:', { 
            font: '16px Arial', 
            fill: '#4CAF50' 
        });
        
        this.add.text(20, 155, this.currentTask.objective, { 
            font: '14px Arial', 
            fill: '#ffffff',
            wordWrap: { width: 760 }
        });
        
        // Dificuldade
        let difficultyStars = '';
        for (let i = 0; i < this.currentTask.difficulty; i++) {
            difficultyStars += '⭐';
        }
        
        this.add.text(20, 200, `Dificuldade: ${difficultyStars}`, { 
            font: '14px Arial', 
            fill: '#FFC107' 
        });
        
        // Recompensas
        this.add.text(20, 225, `Recompensas: ${this.currentTask.reward_xp} XP, R$ ${this.currentTask.reward_money}`, { 
            font: '14px Arial', 
            fill: '#2196F3' 
        });
        
        // Editor de código
        this.createCodeEditor(this.currentTask.initial_code || '# Seu código aqui\n');
    }
    
    setupFreeMode() {
        // Título
        this.add.text(20, 60, 'Modo Livre - Experimente código Python', { 
            font: '18px Arial', 
            fill: '#4CAF50' 
        });
        
        // Dicas
        this.add.text(20, 90, 'Dicas:', { 
            font: '16px Arial', 
            fill: '#FFC107' 
        });
        
        const tips = [
            "- Use 'import pandas as pd' para análise de dados",
            "- Use 'import matplotlib.pyplot as plt' para visualizações",
            "- Os datasets disponíveis: customers_df, sales_df"
        ];
        
        let y = 120;
        for (const tip of tips) {
            this.add.text(20, y, tip, { 
                font: '14px Arial', 
                fill: '#ffffff' 
            });
            y += 25;
        }
        
        // Exemplo de código inicial
        const sampleCode = `# Exemplo - Análise básica de dados
import pandas as pd
import numpy as np

# Criar um dataset simples
data = {
    'nome': ['Ana', 'Bruno', 'Carlos', 'Diana'],
    'idade': [25, 30, 22, 28],
    'salario': [3500, 4200, 2800, 5100]
}

df = pd.DataFrame(data)

# Calcular estatísticas básicas
media_salario = df['salario'].mean()
idade_max = df['idade'].max()

# Exibir resultados
f"Média salarial: R$ {media_salario:.2f}, Idade máxima: {idade_max} anos"
`;
        
        // Editor de código
        this.createCodeEditor(sampleCode);
    }
    
    // Continuação da classe ComputerScene

    createCodeEditor(initialCode) {
        // Criar elemento textarea para o código
        const codeTextArea = document.createElement('textarea');
        codeTextArea.className = 'code-editor';
        codeTextArea.value = initialCode;
        
        // Posicionar o editor
        const editor = this.add.dom(400, 350, codeTextArea);
        
        // Botão de executar
        const runButton = this.add.text(400, 520, 'Executar Código', { 
            font: '18px Arial', 
            fill: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        runButton.setInteractive({ useHandCursor: true });
        
        runButton.on('pointerover', () => {
            runButton.setBackgroundColor('#66BB6A');
        });
        
        runButton.on('pointerout', () => {
            runButton.setBackgroundColor('#4CAF50');
        });
        
        // Área de resultado
        this.resultText = this.add.text(20, 560, '', { 
            font: '14px Arial', 
            fill: '#ffffff',
            wordWrap: { width: 760 }
        });
        
        // Execução do código
        runButton.on('pointerdown', async () => {
            const code = codeTextArea.value;
            
            this.resultText.setText('Executando código...');
            
            // Verificar se Pyodide está inicializado
            if (!pyodideManager.initialized) {
                this.resultText.setText('Erro: Ambiente Python não está pronto. Tente novamente em alguns instantes.');
                return;
            }
            
            try {
                // Carregar datasets necessários, se for uma tarefa
                if (this.currentTask && this.currentTask.datasets) {
                    for (const datasetName of this.currentTask.datasets) {
                        // Obter dataset correspondente
                        let datasetContent = null;
                        
                        switch (datasetName) {
                            case 'sales':
                                datasetContent = SALES_DATASET;
                                break;
                            case 'customers':
                                datasetContent = CUSTOMERS_DATASET;
                                break;
                            default:
                                console.warn(`Dataset não encontrado: ${datasetName}`);
                        }
                        
                        if (datasetContent) {
                            try {
                                await pyodideManager.loadDataset(datasetName, datasetContent);
                            } catch (e) {
                                console.error(`Erro ao carregar dataset ${datasetName}:`, e);
                            }
                        }
                    }
                }
                
                // Executar código
                let result;
                
                if (this.currentTask) {
                    // Modo tarefa - avaliar o resultado
                    result = await pyodideManager.runCode(code, this.currentTask.id);
                } else {
                    // Modo livre - apenas executar
                    result = await pyodideManager.runCode(code);
                }
                
                if (result.success) {
                    if (this.currentTask) {
                        // Mostrar mensagem de sucesso/feedback
                        this.resultText.setText(`✅ ${result.message || 'Código executado com sucesso!'}`);
                        
                        // Se completou a tarefa com sucesso
                        if (result.success) {
                            this.showTaskCompleted();
                        }
                    } else {
                        // Mostrar resultado
                        this.resultText.setText(`Resultado: ${result.result}`);
                    }
                } else {
                    // Mostrar erro
                    this.resultText.setText(`❌ Erro: ${result.error || result.message}`);
                }
            } catch (error) {
                this.resultText.setText(`❌ Erro: ${error.message}`);
            }
        });
    }
    
    showTaskCompleted() {
        // Overlay para mostrar conclusão da tarefa
        const overlay = this.add.rectangle(400, 300, 500, 300, 0x1E88E5, 0.9).setOrigin(0.5);
        
        // Título
        this.add.text(400, 200, 'Tarefa Concluída!', { 
            font: '28px Arial', 
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Detalhes da recompensa
        this.add.text(400, 250, `Você ganhou:`, { 
            font: '20px Arial', 
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(400, 290, `+${this.currentTask.reward_xp} XP`, { 
            font: '18px Arial', 
            fill: '#FFC107'
        }).setOrigin(0.5);
        
        this.add.text(400, 320, `+R$ ${this.currentTask.reward_money}`, { 
            font: '18px Arial', 
            fill: '#4CAF50'
        }).setOrigin(0.5);
        
        // Botão de confirmação
        const confirmButton = this.add.text(400, 380, 'Continuar', { 
            font: '20px Arial', 
            fill: '#ffffff',
            backgroundColor: '#4CAF50',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        confirmButton.setInteractive({ useHandCursor: true });
        confirmButton.on('pointerdown', () => {
            this.closeComputer();
        });
    }
    
    closeComputer() {
        // Retornar para a cena anterior
        this.scene.resume('BuildingScene');
        this.scene.stop();
    }
}

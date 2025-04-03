// Definições das tarefas e desafios
const TASKS_DATA = {
    // Tarefas de análise
    "data_analysis_1": {
        id: "data_analysis_1",
        title: "Análise de Vendas por Região",
        type: "analysis",
        description: "Analise os dados de vendas para identificar quais regiões têm melhor desempenho.",
        difficulty: 1,
        reward_xp: 100,
        reward_money: 200,
        required_skills: ["Python", "Pandas"],
        datasets: ["sales"],
        objective: "Calcular o total de vendas por região e identificar a região com maior faturamento.",
        initial_code: `# Importe as bibliotecas necessárias
import pandas as pd
import numpy as np

# Os dados já estão carregados em 'sales_df'
# Explore os dados
print(sales_df.head())

# TODO: Agrupe os dados por região e calcule o total de vendas

# TODO: Identifique a região com maior faturamento

# Seu código aqui:

`,
        evaluation_code: `
def evaluate_solution(df_result):
    # Verificar se agrupou por região
    if 'region' not in df_result.index.names and 'region' not in df_result.columns:
        return {"success": False, "message": "Você precisa agrupar os dados por região."}
    
    # Verificar se calculou o total de vendas
    if 'sales' not in df_result.columns and 'revenue' not in df_result.columns:
        return {"success": False, "message": "Você precisa calcular o total de vendas ou receita."}
    
    # Verificar se encontrou corretamente a região de maior desempenho
    actual_best_region = "West"  # Resultado esperado com os dados de exemplo
    
    # Verificar se a solução identifica a melhor região
    if actual_best_region not in str(df_result.head(1)):
        return {"success": False, "message": "Você não identificou corretamente a região com maior faturamento."}
    
    return {"success": True, "message": "Ótimo trabalho! Você identificou corretamente que a região West tem o maior faturamento."}
`
    },
    
    // Tarefas de machine learning
    "ml_model_basic": {
        id: "ml_model_basic",
        title: "Modelo de Previsão de Churns",
        type: "machine_learning",
        description: "Desenvolva um modelo para prever quais clientes têm maior probabilidade de cancelar o serviço.",
        difficulty: 2,
        reward_xp: 250,
        reward_money: 500,
        required_skills: ["Python", "Machine Learning"],
        datasets: ["customers"],
        objective: "Criar um modelo de classificação com precisão mínima de 75% para prever churn de clientes.",
        initial_code: `# Importe as bibliotecas necessárias
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Os dados já estão carregados em 'customers_df'
# Explore os dados
print(customers_df.head())

# TODO: Prepare os dados para modelagem
# TODO: Divida em conjuntos de treino e teste
# TODO: Treine um modelo de classificação
# TODO: Avalie a performance do modelo

# Seu código aqui:

`,
        evaluation_code: `
def evaluate_solution(model_result):
    # Verificar se há divisão de treino/teste
    if 'train_test_split' not in user_code:
        return {"success": False, "message": "Você precisa dividir os dados em conjuntos de treino e teste."}
    
    # Verificar se há um modelo treinado
    if 'fit' not in user_code:
        return {"success": False, "message": "Você precisa treinar um modelo com os dados."}
    
    # Verificar avaliação do modelo
    if 'accuracy_score' not in user_code and 'classification_report' not in user_code:
        return {"success": False, "message": "Você precisa avaliar a performance do seu modelo."}
    
    # Verificar precisão do modelo
    try:
        accuracy = float(model_result)
        if accuracy < 0.75:
            return {"success": False, "message": f"A precisão do seu modelo é de {accuracy:.2f}, mas precisamos de pelo menos 0.75."}
        
        return {"success": True, "message": f"Excelente! Seu modelo atingiu uma precisão de {accuracy:.2f}, superando o objetivo de 0.75."}
    except:
        return {"success": False, "message": "Não consegui verificar a precisão do seu modelo. Certifique-se de retornar a métrica de precisão."}
`
    },
    
    // Tarefas de SQL
    "sql_intro": {
        id: "sql_intro",
        title: "Consultas SQL Básicas",
        type: "sql",
        description: "Pratique consultas SQL para extrair informações de um banco de dados de vendas.",
        difficulty: 1,
        reward_xp: 100,
        reward_money: 150,
        required_skills: ["SQL"],
        datasets: ["sales"],
        objective: "Escrever uma consulta SQL que retorne o total de vendas por produto, ordenado do maior para o menor valor.",
        initial_code: `-- Os dados estão em uma tabela chamada 'sales'
-- Colunas: id, date, product_id, quantity, unit_price, customer_id

-- Escreva sua consulta SQL:

`,
        evaluation_code: `
def evaluate_solution(query):
    # Verificar palavras-chave essenciais
    required_keywords = ["SELECT", "FROM", "GROUP BY", "ORDER BY"]
    for keyword in required_keywords:
        if keyword not in query.upper():
            return {"success": False, "message": f"Sua consulta deve incluir {keyword}."}
    
    # Verificar agrupamento por produto
    if "GROUP BY product_id" not in query.lower() and "group by product_id" not in query.lower():
        return {"success": False, "message": "Você deve agrupar os resultados por product_id."}
    
    # Verificar cálculo de total
    if "SUM" not in query.upper():
        return {"success": False, "message": "Use a função SUM() para calcular o total de vendas."}
    
    # Verificar ordenação
    if "DESC" not in query.upper():
        return {"success": False, "message": "Ordene os resultados em ordem decrescente (DESC)."}
    
    return {"success": True, "message": "Excelente trabalho! Sua consulta SQL está correta."}
`
    }
};
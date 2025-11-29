import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def prepare_ai_analysis_prompt(aggregated_anomalies):
    prompt = f"""
Анализируй данные для выявления проблем пользовательского опыта.

КОНТЕКСТ:
Есть данные о возможной аномалии в версии.

ДАННЫЕ ДЛЯ АНАЛИЗА:
{aggregated_anomalies}

ЗАДАЧИ:
1. Сгруппируй аномалии по типам UX-проблем (технические, навигационные, контентные, функциональные)
2. Определи возможные root-cause
3. Предложи гипотезы для проверки
4. Оцени критичность проблем (1-10 баллов)
5. Предложи конкретные рекомендации по исправлению

ФОРМАТ ОТВЕТА:
- Группа проблем: [тип]
- Вероятные причины: [список]
- Критичность: [оценка]
- Рекомендации: [конкретные действия]
- Метрики для мониторинга: [список]
"""
    return prompt


def get_ai_analysis(aggregated_anomalies):
    folder_id = os.environ['folder_id']
    api_key = os.environ['api_key']
    
    model = f"gpt://{folder_id}/qwen3-235b-a22b-fp8/latest"

    client = OpenAI(
        base_url="https://rest-assistant.api.cloud.yandex.net/v1",
        api_key=api_key,
    )

    prompt = prepare_ai_analysis_prompt(aggregated_anomalies)

    try:
        response = client.responses.create(
            model = model,
            input = prompt
        )
        return response.output_text
    except Exception as e:
        return f"Ошибка при обращении к API: {str(e)}"
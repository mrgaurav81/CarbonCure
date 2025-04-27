import os
import json
import openai

def get_recommendations(data, emissions, sustainability_score):
    """Get AI-generated recommendations for reducing carbon emissions"""
    try:
        # Check if API key exists
        api_key = os.environ.get("OPEN_AI_API_KEY")
        if not api_key:
            print("Warning: OPEN_AI_API_KEY not set in environment variables. Using fallback recommendations.")
            return get_fallback_recommendations()
        
        openai.api_key = api_key
        
        # Create prompt for the AI
        prompt = f"""
        As a sustainability expert, provide 3-5 specific recommendations for a company to reduce their carbon emissions.

        Company data:
        - Total carbon emissions: {emissions} kg CO2
        - Sustainability score: {sustainability_score}/100
        - Energy usage: {data.get('energy', {})}
        - Transportation: {data.get('transportation', {})}
        - Manufacturing: {data.get('manufacturing', {})}

        Focus on practical, actionable recommendations with estimated impact percentages.
        Format your response as a JSON array of objects, where each object has 'title', 'description', and 'impact_percentage' fields.
        """
        
        # Get response from OpenAI ChatGPT
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1000,
            n=1,
            stop=None,
        )
        
        response_text = response['choices'][0]['message']['content']
        
        # Try to find JSON in the response
        try:
            import re
            json_match = re.search(r'\[\s*{.*}\s*\]', response_text, re.DOTALL)
            if json_match:
                recommendations = json.loads(json_match.group(0))
                return recommendations
            else:
                print("Couldn't extract JSON from response. Using fallback recommendations.")
                return get_fallback_recommendations()
        except Exception as e:
            print(f"Error parsing AI response: {e}")
            return get_fallback_recommendations()
        
    except Exception as e:
        print(f"Error with AI integration: {e}")
        return get_fallback_recommendations()

def get_fallback_recommendations():
    """Return fallback recommendations if AI integration fails"""
    return [
        {
            "title": "Switch to Renewable Energy",
            "description": "Replace fossil fuel energy sources with renewable alternatives like solar or wind power.",
            "impact_percentage": 25
        },
        {
            "title": "Optimize Transportation",
            "description": "Implement a fleet management system to reduce unnecessary travel and optimize routes.",
            "impact_percentage": 15
        },
        {
            "title": "Reduce Waste in Manufacturing",
            "description": "Implement a circular economy approach to minimize waste and reuse materials.",
            "impact_percentage": 20
        },
        {
            "title": "Energy Efficiency Audit",
            "description": "Conduct a comprehensive energy audit to identify areas for improvement.",
            "impact_percentage": 10
        },
        {
            "title": "Remote Work Policy",
            "description": "Implement flexible remote work to reduce commuting emissions.",
            "impact_percentage": 8
        }
    ]

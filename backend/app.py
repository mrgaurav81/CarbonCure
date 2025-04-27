from flask import Flask, request, jsonify
from flask_cors import CORS
import calculator
import db
import ai_integration
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/calculate', methods=['POST'])
def calculate_emissions():
    """Calculate emissions based on input data"""
    data = request.json
    
    # Calculate total emissions
    emissions = calculator.calculate_total_emissions(data)
    
    # Calculate sustainability score (0-100)
    sustainability_score = calculator.calculate_score(emissions)
    
    # Get AI recommendations
    recommendations = ai_integration.get_recommendations(data, emissions, sustainability_score)
    
    # Save data to database
    db.save_calculation(data, emissions, sustainability_score, recommendations)
    
    return jsonify({
        'emissions': emissions,
        'sustainability_score': sustainability_score,
        'recommendations': recommendations
    })

@app.route('/api/history/<company_id>', methods=['GET'])
def get_history(company_id):
    """Get historical data for a company"""
    history = db.get_company_history(company_id)
    return jsonify(history)

if __name__ == '__main__':
    # Make sure database is initialized
    db.init_db()
    print("Server running at http://localhost:5000")
    app.run(debug=True)
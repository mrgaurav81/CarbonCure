def calculate_total_emissions(data):
    """Calculate total carbon emissions based on input data"""
    emissions = 0
    
    # Energy usage emissions
    if 'energy' in data:
        energy_kwh = data['energy'].get('electricity', 0)
        emissions += energy_kwh * 0.4  # Example factor: 0.4 kg CO2 per kWh
        
        natural_gas = data['energy'].get('natural_gas', 0)
        emissions += natural_gas * 2.0  # Example factor: 2.0 kg CO2 per unit
    
    # Transportation emissions
    if 'transportation' in data:
        vehicle_miles = data['transportation'].get('vehicle_miles', 0)
        emissions += vehicle_miles * 0.35  # Example factor: 0.35 kg CO2 per mile
        
        air_travel = data['transportation'].get('air_travel', 0)
        emissions += air_travel * 0.2  # Example factor: 0.2 kg CO2 per mile
    
    # Manufacturing emissions
    if 'manufacturing' in data:
        raw_materials = data['manufacturing'].get('raw_materials', 0)
        emissions += raw_materials * 2.5  # Example factor
        
        waste = data['manufacturing'].get('waste', 0)
        emissions += waste * 1.8  # Example factor
    
    return emissions

def calculate_score(emissions):
    """Calculate sustainability score (0-100) based on emissions"""
    # Example scoring logic (you would refine this with more complex algorithms)
    
    # Lower emissions = higher score
    if emissions <= 1000:
        base_score = 90
    elif emissions <= 5000:
        base_score = 70
    elif emissions <= 10000:
        base_score = 50
    elif emissions <= 20000:
        base_score = 30
    else:
        base_score = 10
    
    # Apply some randomness for demo purposes
    import random
    variation = random.randint(-5, 5)
    
    final_score = max(0, min(100, base_score + variation))
    return final_score
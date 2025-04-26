// API functions
function calculateEmissions(formData) {
    // Show loading spinner
    document.body.classList.add('loading');
    
    // In a real implementation, this would call your backend API
    // For the hackathon demo, we'll simulate the API call
    
    setTimeout(() => {
        // Save form data to session storage
        sessionStorage.setItem('companyData', JSON.stringify(formData));
        
        // Calculate mock results
        const mockResults = {
            emissions: calculateMockEmissions(formData),
            sustainability_score: calculateMockScore(formData),
            recommendations: getMockRecommendations(formData)
        };
        
        // Save results to session storage
        sessionStorage.setItem('carbonResults', JSON.stringify(mockResults));
        
        // Redirect to results page
        window.location.href = 'results.html';
    }, 1500);
}

// Mock calculations for hackathon demo
function calculateMockEmissions(data) {
    let emissions = 0;
    
    // Energy
    emissions += (data.energy.electricity * 0.4); // 0.4 kg CO2 per kWh
    emissions += (data.energy.natural_gas * 2.0); // 2.0 kg CO2 per therm
    
    // Transportation
    emissions += (data.transportation.vehicle_miles * 0.35); // 0.35 kg CO2 per mile
    emissions += (data.transportation.air_travel * 0.2); // 0.2 kg CO2 per mile
    
    // Manufacturing
    emissions += (data.manufacturing.raw_materials * 2.5); // 2.5 kg CO2 per ton
    emissions += (data.manufacturing.waste * 1.8); // 1.8 kg CO2 per ton
    
    return emissions;
}

function calculateMockScore(data) {
    const emissions = calculateMockEmissions(data);
    
    // Simple scoring logic
    if (emissions <= 1000) return 95;
    if (emissions <= 5000) return 75;
    if (emissions <= 10000) return 60;
    if (emissions <= 20000) return 40;
    return 20;
}

function getMockRecommendations(data) {
    // In a real implementation, these would come from the Claude API
    return [
        {
            title: "Switch to Renewable Energy",
            description: "Transition to renewable energy sources like solar or wind to power your operations.",
            impact_percentage: 25
        },
        {
            title: "Implement Remote Work Policies",
            description: "Reduce commuting emissions by allowing employees to work remotely when possible.",
            impact_percentage: 15
        },
        {
            title: "Optimize Supply Chain",
            description: "Work with suppliers closer to your location to reduce transportation emissions.",
            impact_percentage: 20
        },
        {
            title: "Reduce Waste",
            description: "Implement recycling programs and reduce single-use materials in your operations.",
            impact_percentage: 10
        }
    ];
}
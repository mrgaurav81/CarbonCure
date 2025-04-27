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
            impact_percentage: 25,
            priority: data.energy.electricity > 50000 ? "high" : "medium",
            implementation_time: "medium",
            category: "energy"
        },
        {
            title: "Implement Remote Work Policies",
            description: "Reduce commuting emissions by allowing employees to work remotely when possible.",
            impact_percentage: 15,
            priority: data.transportation.employee_commute > 500 ? "high" : "medium",
            implementation_time: "quick",
            category: "transportation"
        },
        {
            title: "Optimize Supply Chain",
            description: "Work with suppliers closer to your location to reduce transportation emissions.",
            impact_percentage: 20,
            priority: data.transportation.vehicle_miles > 10000 ? "high" : "medium",
            implementation_time: "long",
            category: "manufacturing"
        },
        {
            title: "Reduce Waste",
            description: "Implement recycling programs and reduce single-use materials in your operations.",
            impact_percentage: 10,
            priority: data.manufacturing.waste > 5000 ? "high" : "low",
            implementation_time: "quick",
            category: "waste"
        }
    ];
}

// Update form summary during calculation
function updateFormSummary(formData) {
    // Calculate emissions for each category
    const energyEmissions = (formData.energy.electricity * 0.4) + (formData.energy.natural_gas * 2.0);
    const transportEmissions = (formData.transportation.vehicle_miles * 0.35) + (formData.transportation.air_travel * 0.2);
    const operationsEmissions = (formData.manufacturing.raw_materials * 2.5) + (formData.manufacturing.waste * 1.8);
    const totalEmissions = energyEmissions + transportEmissions + operationsEmissions;
    
    // Update summary in sidebar
    document.getElementById('energy-summary').textContent = Math.round(energyEmissions) + ' kg CO₂e';
    document.getElementById('transportation-summary').textContent = Math.round(transportEmissions) + ' kg CO₂e';
    document.getElementById('operations-summary').textContent = Math.round(operationsEmissions) + ' kg CO₂e';
    document.getElementById('total-summary').textContent = Math.round(totalEmissions) + ' kg CO₂e';
    
    // Update preliminary results
    document.getElementById('emissions-preview').textContent = Math.round(totalEmissions / 1000);
    
    // Update score preview
    const score = calculateMockScore(formData);
    document.getElementById('score-preview').textContent = score;
    
    // Update score color
    const scoreElement = document.getElementById('score-preview');
    if (score >= 75) {
        scoreElement.style.backgroundColor = '#27ae60'; // Green for good
    } else if (score >= 50) {
        scoreElement.style.backgroundColor = '#f39c12'; // Orange for medium
    } else {
        scoreElement.style.backgroundColor = '#e74c3c'; // Red for poor
    }
}

// Handle emission form submission and call backend API
document.addEventListener('DOMContentLoaded', function() {
    // If we're on the calculator page
    if (document.getElementById('emissions-form')) {
        const form = document.getElementById('emissions-form');
        
        // Update preliminary results as user fills the form
        const inputElements = form.querySelectorAll('input, select');
        inputElements.forEach(input => {
            input.addEventListener('change', function() {
                const formData = getFormData();
                updateFormSummary(formData);
            });
        });
        
        // Handle form submission
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = getFormData();
            calculateEmissions(formData);
        });
        
        // Also handle the submit button click separately
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', function(event) {
                event.preventDefault();
                const formData = getFormData();
                calculateEmissions(formData);
            });
        }
    }
    
    // If we're on the results page
    if (window.location.pathname.includes('results.html')) {
        loadResultsData();
    }
});

// Helper function to get all form data
function getFormData() {
    return {
        company: {
            name: document.getElementById('company-name')?.value || 'Company Name',
            industry: document.getElementById('industry')?.value || 'Industry',
            employees: parseInt(document.getElementById('employees')?.value) || 0,
            facility_size: parseFloat(document.getElementById('facility-size')?.value) || 0
        },
        energy: {
            electricity: parseFloat(document.getElementById('electricity')?.value) || 0,
            natural_gas: parseFloat(document.getElementById('natural-gas')?.value) || 0,
            renewable_percentage: parseFloat(document.getElementById('renewable-percentage')?.value) || 0,
            heating_oil: parseFloat(document.getElementById('heating-oil')?.value) || 0
        },
        transportation: {
            vehicle_miles: parseFloat(document.getElementById('vehicle-miles')?.value) || 0,
            vehicle_type: document.getElementById('vehicle-type')?.value || '',
            air_travel: parseFloat(document.getElementById('air-travel')?.value) || 0,
            employee_commute: parseFloat(document.getElementById('employee-commute')?.value) || 0
        },
        manufacturing: {
            raw_materials: parseFloat(document.getElementById('raw-materials')?.value) || 0,
            material_type: document.getElementById('material-type')?.value || '',
            waste: parseFloat(document.getElementById('waste')?.value) || 0,
            recycling_percentage: parseFloat(document.getElementById('recycling-percentage')?.value) || 0
        }
    };
}

// Load results data on the results page
function loadResultsData() {
    try {
        // Retrieve stored data
        const companyData = JSON.parse(sessionStorage.getItem('companyData'));
        const results = JSON.parse(sessionStorage.getItem('carbonResults'));
        
        if (companyData && results) {
            // Display company info
            document.getElementById('result-company-name').textContent = companyData.company.name;
            document.getElementById('result-industry').textContent = companyData.company.industry;
            
            // Set the date dynamically
            const currentDate = new Date();
            document.getElementById('report-date').textContent = currentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Display total emissions with animation
            animateCounter('total-emissions', 0, Math.round(results.emissions), 1500);
            
            // Display sustainability score with animation
            animateCounter('sustainability-score', 0, results.sustainability_score, 2000);
            
            // Render sustainability score chart
            renderScoreChart(results.sustainability_score);
            
            // Create emissions breakdown chart
            renderEmissionsChart(companyData);
            
            // Display recommendations
            displayRecommendations(results.recommendations);
        }
    } catch (error) {
        console.error("Error loading results data:", error);
    }
}
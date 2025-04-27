// API functions
async function calculateEmissions(formData) {
    // Show loading spinner
    document.body.classList.add('loading');
    
    try {
        // Call the real backend API
        const response = await fetch('http://localhost:5000/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('API error');
        }
        
        const results = await response.json();
        
        // Save form data and results to session storage
        sessionStorage.setItem('companyData', JSON.stringify(formData));
        sessionStorage.setItem('carbonResults', JSON.stringify(results));
        
        // Redirect to results page
        window.location.href = 'results.html';
        
    } catch (error) {
        console.error('Error calling API:', error);
        
        // Fallback to mock data if API fails
        const mockResults = {
            emissions: calculateMockEmissions(formData),
            sustainability_score: calculateMockScore(formData),
            recommendations: getMockRecommendations(formData)
        };
        
        // Save results to session storage
        sessionStorage.setItem('companyData', JSON.stringify(formData));
        sessionStorage.setItem('carbonResults', JSON.stringify(mockResults));
        
        // Redirect to results page
        window.location.href = 'results.html';
    } finally {
        // Remove loading spinner
        document.body.classList.remove('loading');
    }
}

// Keep the mock functions as fallbacks
function calculateMockEmissions(data) {
    // [Keep the existing mock function implementation]
}

function calculateMockScore(data) {
    // [Keep the existing mock function implementation]
}

function getMockRecommendations(data) {
    // [Keep the existing mock function implementation]
}
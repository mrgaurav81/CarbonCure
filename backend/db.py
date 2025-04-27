import sqlite3
import json
import datetime

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect('carbon_cure.db')
    cursor = conn.cursor()
    
    # Create companies table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS companies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        industry TEXT,
        size TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create calculations table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER,
        input_data TEXT,
        emissions REAL,
        sustainability_score INTEGER,
        recommendations TEXT,
        calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id)
    )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized successfully")

def save_calculation(data, emissions, sustainability_score, recommendations):
    """Save calculation results to database"""
    conn = sqlite3.connect('carbon_cure.db')
    cursor = conn.cursor()
    
    # Get company information
    company_name = data.get('company', {}).get('name', 'Unknown')
    company_industry = data.get('company', {}).get('industry', 'Unknown')
    company_size = data.get('company', {}).get('employees', 0)
    
    # Check if company exists
    cursor.execute('SELECT id FROM companies WHERE name = ?', (company_name,))
    company = cursor.fetchone()
    
    if company:
        company_id = company[0]
    else:
        # Create new company
        cursor.execute('''
        INSERT INTO companies (name, industry, size)
        VALUES (?, ?, ?)
        ''', (company_name, company_industry, str(company_size)))
        company_id = cursor.lastrowid
    
    # Save calculation
    cursor.execute('''
    INSERT INTO calculations (company_id, input_data, emissions, sustainability_score, recommendations)
    VALUES (?, ?, ?, ?, ?)
    ''', (
        company_id,
        json.dumps(data),
        emissions,
        sustainability_score,
        json.dumps(recommendations)
    ))
    
    conn.commit()
    conn.close()
    
    return True

def get_company_history(company_id):
    """Get calculation history for a company"""
    conn = sqlite3.connect('carbon_cure.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('''
    SELECT * FROM calculations
    WHERE company_id = ?
    ORDER BY calculated_at DESC
    ''', (company_id,))
    
    rows = cursor.fetchall()
    history = []
    
    for row in rows:
        history.append({
            'id': row['id'],
            'emissions': row['emissions'],
            'sustainability_score': row['sustainability_score'],
            'recommendations': json.loads(row['recommendations']),
            'calculated_at': row['calculated_at']
        })
    
    conn.close()
    return history
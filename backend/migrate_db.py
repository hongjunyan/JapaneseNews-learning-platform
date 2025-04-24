import sqlite3
from datetime import datetime
import os

# Ensure the data directory exists
if not os.path.exists('data'):
    os.makedirs('data')

# Connect to the database
conn = sqlite3.connect('./data/jpnews.db')
cursor = conn.cursor()

try:
    # Check if the updated_at column exists
    cursor.execute("PRAGMA table_info(news)")
    columns = cursor.fetchall()
    column_names = [column[1] for column in columns]
    
    if 'updated_at' not in column_names:
        # Add the updated_at column if it doesn't exist
        print("Adding updated_at column to news table...")
        cursor.execute("ALTER TABLE news ADD COLUMN updated_at TEXT")
        
        # Update existing records with current timestamp
        current_time = datetime.now().isoformat()
        cursor.execute("UPDATE news SET updated_at = ?", (current_time,))
        
        print(f"Updated {cursor.rowcount} records with timestamp: {current_time}")
    else:
        print("The updated_at column already exists.")
    
    # Commit the changes
    conn.commit()
    print("Database migration completed successfully.")
    
except Exception as e:
    conn.rollback()
    print(f"Error during migration: {e}")
    
finally:
    # Close the connection
    conn.close() 
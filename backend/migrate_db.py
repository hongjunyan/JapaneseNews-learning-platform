"""
Database migration script for the Japanese News platform.
This script can be run to perform database migrations when the schema changes.
"""

import sqlite3
import os

# Create database directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

# Database file path
DB_PATH = 'data/jpnews.db'

def check_column_exists(conn, table_name, column_name):
    """Check if a column exists in a table"""
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = cursor.fetchall()
    return any(column[1] == column_name for column in columns)

def add_column(conn, table_name, column_name, column_type):
    """Add a column to a table if it doesn't exist"""
    cursor = conn.cursor()
    cursor.execute(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_type}")
    conn.commit()

def run_migration():
    """Run the database migration"""
    print("Starting database migration...")
    
    # Connect to the database
    conn = sqlite3.connect(DB_PATH)
    
    # Check if the news table exists, if not we assume this is a fresh installation
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='news'")
    table_exists = cursor.fetchone() is not None
    
    if not table_exists:
        print("News table doesn't exist. No migration needed.")
        conn.close()
        return
    
    # Check if youtube_url column exists, if not add it
    if not check_column_exists(conn, 'news', 'youtube_url'):
        print("Adding youtube_url column to news table...")
        add_column(conn, 'news', 'youtube_url', 'TEXT')
        print("Column added successfully.")
    else:
        print("youtube_url column already exists.")
    
    conn.close()
    print("Migration completed.")

if __name__ == "__main__":
    run_migration() 
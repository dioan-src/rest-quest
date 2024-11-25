MYSQL_USER="root"
MYSQL_PASSWORD=""
SQL_FILE="./data/db_setup.sql"

# Check if SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "SQL file not found: $SQL_FILE"
    exit 1
fi

# Run the SQL file
echo "Running SQL file: $SQL_FILE"
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" < "$SQL_FILE"

# Check if the command succeeded
if [ $? -eq 0 ]; then
    echo "SQL file executed successfully."
else
    echo "An error occurred while executing the SQL file."
fi
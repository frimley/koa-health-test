psql -h localhost -U postgres -d postgres -a -f /etc/postgresql/sql/create_db.sql
psql -h localhost -U postgres -d healthy_habits -a -f /etc/postgresql/sql/create_objects-ddl.sql
psql -h localhost -U postgres -d healthy_habits -a -f /etc/postgresql/sql/create_data-dml.sql

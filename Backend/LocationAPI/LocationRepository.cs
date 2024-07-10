using Npgsql;

namespace LocationAPI
{
    public class LocationRepository : ILocationRepository
    {
        private readonly IDbConnections _connectionFactory;
        public readonly string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=postgres;";
        public LocationRepository(IDbConnections connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task<Dictionary<string, object>> UpdateLocationAsync(Guid id, LocationUpdate updatedLocation)
        {
            if (id == Guid.Empty || updatedLocation == null)
            {
                return new Dictionary<string, object>();
            }

            string[] columnName = { "location_code", "_name", "description", "region", "site", "inventory_location", "parent_id" };

            using (var connection = _connectionFactory.CreateConnection(connectionString))
            {
                await connection.OpenAsync();

                var cmd = new NpgsqlCommand("UPDATE locations SET ", connection);

                var properties = updatedLocation.GetType().GetProperties();

                var column = 0;
                foreach (var property in properties)
                {
                    var propertyValue = property.GetValue(updatedLocation);

                    if (propertyValue != null)
                    {
                        cmd.CommandText += $"{columnName[column]} = @{columnName[column]}, ";
                        cmd.Parameters.AddWithValue(columnName[column], propertyValue);
                    }
                    column++;
                }

                cmd.CommandText = cmd.CommandText.TrimEnd(' ', ',') + " WHERE id = @id RETURNING *";
                cmd.Parameters.AddWithValue("id", id);

                var cmdSelect = new NpgsqlCommand("SELECT * FROM locations WHERE id = @id", connection);
                cmdSelect.Parameters.AddWithValue("id", id);

                await cmd.ExecuteNonQueryAsync();

                var reader = await cmdSelect.ExecuteReaderAsync();
                
                if (reader.Read())
                {
                    var location = new Dictionary<string, object>
                {
                    { "id", reader["id"] },
                    { "location_code", reader["location_code"] },
                    { "name", reader["_name"] },
                    { "description", reader["description"] },
                    { "inventory_location", reader["inventory_location"] },
                    { "region", reader["region"] },
                    { "site", reader["site"] },
                    { "parent_id", reader["parent_id"] }
                };

                    return location;
                }
                else
                {
                    return new Dictionary<string, object>(); 
                }
                
            }
        }
        public async Task<Dictionary<string, object>> DeleteLocationAsync(Guid id)
        {
            if (id == Guid.Empty || id == null)
            {
                return new Dictionary<string, object>();
            }
            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();

            var cmdSelect = new NpgsqlCommand("SELECT * FROM locations WHERE id = @id", connection);
            cmdSelect.Parameters.AddWithValue("id", id);

            Dictionary<string, object> location = null;

            using (NpgsqlDataReader reader = await cmdSelect.ExecuteReaderAsync())
            {
                if (reader.Read())
                {
                    location = new Dictionary<string, object>
                {
                    { "id", reader["id"] },
                    { "location_code", reader["location_code"] },
                    { "name", reader["_name"] },
                    { "description", reader["description"] },
                    { "inventory_location", reader["inventory_location"] },
                    { "region", reader["region"] },
                    { "site", reader["site"] },
                    { "parent_id", reader["parent_id"] }
                };
                }
                else
                {
                    return new Dictionary<string, object>();
                }
            }
            
            var cmdDelete = new NpgsqlCommand("DELETE FROM locations WHERE id = @id", connection);
            cmdDelete.Parameters.AddWithValue("id", id);
            cmdDelete.ExecuteNonQuery();

            return location;
        }
   

        public async Task<List<Dictionary<string, object>>> GetAllLocationsAsync()
        {
            List<Dictionary<string, object>> allLocations = new List<Dictionary<string, object>>();

            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();
            NpgsqlCommand command = new NpgsqlCommand("SELECT id, location_code, _name, description, region, site, inventory_location, parent_id FROM locations", connection);

            NpgsqlDataReader reader = await command.ExecuteReaderAsync();

            while (reader.Read())
            {
                var location = new Dictionary<string, object>
                {
                    { "id", reader["id"] },
                    { "location_code", reader["location_code"] },
                    { "name", reader["_name"] },
                    { "description", reader["description"] },
                    { "inventory_location", reader["inventory_location"] },
                    { "region", reader["region"] },
                    { "site", reader["site"] },
                    { "parent_id", reader["parent_id"] }
                };

                allLocations.Add(location);
            }

            await Task.Delay(3000);

            return allLocations;
        }

        public async Task<Dictionary<string, Guid>> CreateLocationAsync(Location location)
        {
            if (location == null)
            {
                return new Dictionary<string, Guid>();
            }

            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();

            NpgsqlCommand command = new NpgsqlCommand(
                "INSERT INTO locations (location_code, _name, description, region, site, inventory_location, parent_id) " +
                "VALUES (@value1, @value2, @value3, @value4, @value5, @value6, @value7) RETURNING id", connection);

            command.Parameters.AddWithValue("@value1", location.LocationCode);
            command.Parameters.AddWithValue("@value2", location.Name);
            command.Parameters.AddWithValue("@value3", location.Description);
            command.Parameters.AddWithValue("@value4", (int)LocationType.Region);
            command.Parameters.AddWithValue("@value5", (int)LocationType.Site);
            command.Parameters.AddWithValue("@value6", location.InventoryLocation);
            command.Parameters.AddWithValue("@value7", location.ParentId);

            Guid guidId = (Guid)await command.ExecuteScalarAsync();
            connection.Close();

            return new Dictionary<string, Guid> { { "id", guidId } };
        }

        public async Task<Dictionary<string, object>> GetLocationAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return new Dictionary<string, object>();
            }
            
            Dictionary<string, object> location;

            var connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();

            var cmdSelect = new NpgsqlCommand("SELECT * FROM locations WHERE id = @id", connection);
            cmdSelect.Parameters.AddWithValue("id", id);

            using (var reader = await cmdSelect.ExecuteReaderAsync())
            {
                if (reader.Read())
                {
                    location = new Dictionary<string, object>
                    {
                        { "id", reader["id"] },
                        { "location_code", reader["location_code"] },
                        { "name", reader["_name"] },
                        { "description", reader["description"] },
                        { "inventory_location", reader["inventory_location"] },
                        { "region", reader["region"] },
                        { "site", reader["site"] },
                        { "parent_id", reader["parent_id"] }
                    };
                    return location;
                }
                else
                {
                    return new Dictionary<string, object>();
                }
            }
            
        }
    }
}

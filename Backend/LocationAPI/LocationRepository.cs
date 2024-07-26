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
            var locationCheck = await GetLocationAsync(id);

            if (locationCheck.Count == 0 || updatedLocation == null)
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
   
        public async Task<Dictionary<string, object>> GetPaginationAsync(int page, int page_length, bool isNewestFirst)
{
    Dictionary<string, object> result = new Dictionary<string, object>();
    List<Dictionary<string, object>> locations = new List<Dictionary<string, object>>();
    int totalCount = 0;

    if (page_length > 100)
    {
        result["error"] = "Maximum page length exceeded";
        return result;
    }

    using (NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString))
    {
        await connection.OpenAsync();

        // Get total count
        using (NpgsqlCommand countCommand = new NpgsqlCommand("SELECT COUNT(*) FROM locations", connection))
        {
            totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
        }

        // Define the sorting order based on isNewestFirst
        string orderBy = isNewestFirst ? "ORDER BY created_at DESC" : "ORDER BY created_at ASC";

        // Get paginated rows with sorting
        string query = $@"
            SELECT id, location_code, _name, description, region, site, inventory_location, parent_id, created_at
            FROM locations
            {orderBy}
            LIMIT @page_length OFFSET @offset";

        using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
        {
            command.Parameters.AddWithValue("@page_length", page_length);
            command.Parameters.AddWithValue("@offset", (page - 1) * page_length);

            using (NpgsqlDataReader reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
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
                        { "parent_id", reader["parent_id"] },
                        { "created_at", reader["created_at"] }
                    };
                    locations.Add(location);
                }
            }
        }
    }

    // Calculate pagination
    int totalPages = (int)Math.Ceiling(totalCount * 1.0 / page_length);

    if (page > totalPages)
    {
        result["error"] = "Page number exceeds total pages";
        return result;
    }

    // Get the data for the requested page
    var pageData = locations;

    result["total_count"] = totalCount;
    result["page_data"] = pageData;
    result["page"] = page;
    result["total_pages"] = totalPages;
    result["page_length"] = pageData.Count;

    return result;
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

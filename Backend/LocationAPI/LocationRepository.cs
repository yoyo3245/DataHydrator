﻿using System.ComponentModel.DataAnnotations;
using System.Text;
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
                return new Dictionary<string, object> { { "error", "Bad Request" } };
            }

            string[] columnName = { "location_code", "_name", "description", "location_type_id", "inventory_location", "parent_id" };

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
                    { "location_type_id", reader["location_type_id"] }, 
                    { "parent_id", reader["parent_id"] }
                };

                    return location;
                }
                else
                {
                    return new Dictionary<string, object> { { "error", "Bad Request" } };
                }
                
            }
        }
        public async Task<Dictionary<string, object>> DeleteLocationAsync(Guid id)
        {
            if (id == Guid.Empty || id == null)
            {
                return new Dictionary<string, object> { { "error", "Not Found" } };
            }
            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();
            var query = @"
            SELECT 
            l.id, l.location_code, l._name, l.description, lt.name as location_type, l.inventory_location, l.parent_id, l.created_at 
            FROM locations l left join location_types lt  on l.location_type_id = lt.id 
            WHERE l.id = @id;";
            var cmdSelect = new NpgsqlCommand(query , connection);
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
                        { "location_type", reader["location_type"] },
                        { "parent_id", reader["parent_id"] }
                    };
                    }
                else
                {
                    return new Dictionary<string, object> { { "error", "Bad Request" } };
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

                if (totalCount == 0) {
                    result["total_count"] = totalCount;
                    result["page_data"] = locations;
                    result["page"] = page;
                    result["total_pages"] = 1;
                    result["page_length"] = 0;
                    return result;
                }
                // Define the sorting order based on isNewestFirst
                string orderBy = isNewestFirst ? "ORDER BY created_at DESC" : "ORDER BY created_at ASC";

                // Get paginated rows with sorting
                string query = $@"
                    SELECT l.id, l.location_code, l._name, l.description, lt.name as location_type, l.inventory_location, l.parent_id, l.created_at
                    FROM locations l left join location_types lt  on l.location_type_id = lt.id
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
                                { "location_type", reader["location_type"] },
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

            return allLocations;
        }

        private Dictionary<string, string> ValidateLocation(Location location)
        {
            var errors = new Dictionary<string, string>();

            if (location == null)
            {
                errors["Location"] = "Location cannot be null.";
                return errors;
            }

            if (string.IsNullOrWhiteSpace(location.LocationCode))
            {
                errors["LocationCode"] = "Location code is required.";
            }

            if (string.IsNullOrWhiteSpace(location.Name))
            {
                errors["Name"] = "Name is required.";
            }

            if (string.IsNullOrWhiteSpace(location.LocationId) && !Guid.TryParse(location.LocationId, out _))
            {
                errors["LocationId"] = "Invalid Location ID format.";
            }

            if (string.IsNullOrWhiteSpace(location.ParentId) && !Guid.TryParse(location.ParentId, out _))
            {
                errors["ParentId"] = "Invalid Parent ID format.";
            }

            // You can add more validations as needed

            return errors;
        }

        public async Task<Dictionary<string, object>> CreateLocationAsync(Location location)
        {
            if (ValidateLocation(location).Count > 0)
            {
                return new Dictionary<string, object> { { "error", "Bad Request" } };
            }
            var LocationId = Guid.Parse(location.LocationId);
            var ParentId = Guid.Parse(location.ParentId);

            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();

            NpgsqlCommand command = new NpgsqlCommand(
                "INSERT INTO locations (location_code, _name, description, location_type_id, inventory_location, parent_id) " +
                "VALUES (@value1, @value2, @value3, @value4, @value5, @value6) RETURNING id", connection);

            command.Parameters.AddWithValue("@value1", location.LocationCode);
            command.Parameters.AddWithValue("@value2", location.Name);
            command.Parameters.AddWithValue("@value3", location.Description);
            command.Parameters.AddWithValue("@value4", LocationId);
            command.Parameters.AddWithValue("@value5", location.InventoryLocation);
            command.Parameters.AddWithValue("@value6", ParentId);

            Guid guidId = (Guid)await command.ExecuteScalarAsync();
            connection.Close();

            return new Dictionary<string, object> { { "id", guidId } };
        }

        public async Task<Dictionary<string, object>> GetLocationAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                return new Dictionary<string, object> { { "error", "Not Found" } };
            }
            
            Dictionary<string, object> location;

            var connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();

            var cmdCount = new NpgsqlCommand("SELECT COUNT(*) FROM locations where id = @id", connection);
            cmdCount.Parameters.AddWithValue("id", id);
            var totalCount = Convert.ToInt32(await cmdCount.ExecuteScalarAsync());

            if (totalCount == 0)
            {
                return new Dictionary<string, object> { { "error", "Not Found" } };
            }

            var query = $@"
                SELECT l.id, l.location_code, l._name, l.description, lt.name AS location_type, l.inventory_location, l.parent_id 
                FROM locations l
                LEFT JOIN location_types lt ON l.location_type_id = lt.id
                WHERE l.id = @id";

            var cmdSelect = new NpgsqlCommand(query, connection);
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
                        { "location_type", reader["location_type"] },
                        { "parent_id", reader["parent_id"] }
                    };
                    return location;
                }
                else
                {
                    return new Dictionary<string, object> { { "error", "Not Found" } };
                }
            }
            
        }

        public async Task<List<Dictionary<string, object>>> GetAllLocationTypesAsync()
        {
            List<Dictionary<string, object>> allTypes = new List<Dictionary<string, object>>();

            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();
            NpgsqlCommand command = new NpgsqlCommand("SELECT id, name FROM location_types", connection);

            NpgsqlDataReader reader = await command.ExecuteReaderAsync();

            while (reader.Read())
            {
                var type = new Dictionary<string, object>
                {
                    { "id", reader["id"] },
                    { "name", reader["name"] }
                };

                allTypes.Add(type);
            }

            return allTypes;
        }

        public async Task<Dictionary<string, object>> DeleteLocationTypeAsync(Guid id)
        {
            var forbiddenId1 = new Guid("39d802c5-4dfb-4773-9860-11207fc01ff8");
            var forbiddenId2 = new Guid("871df559-4248-4fbd-b89e-827582ed656c");
            Dictionary<string, object> location = new Dictionary<string, object>();

            if (id == Guid.Empty || id == null)
            {
                return new Dictionary<string, object> { { "error", "Location Type Not Found" } };
            }

            else if (id == forbiddenId1 || id == forbiddenId2) 
            {
                location["error"] = "Cannot delete 'Region' or 'site'";
                return location;
            }
                
            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();

            var cmdCount = new NpgsqlCommand("SELECT COUNT(*) FROM locations where location_type_id = @id", connection);
            cmdCount.Parameters.AddWithValue("id", id);
            var totalCount = Convert.ToInt32(await cmdCount.ExecuteScalarAsync());

            if (totalCount != 0) {
                location["error"] = "Cannot delete: Type in use";
                return location;
            }


            var query = @"
            SELECT id, name
            FROM location_types 
            WHERE id = @id;";
            var cmdSelect = new NpgsqlCommand(query , connection);
            cmdSelect.Parameters.AddWithValue("id", id);

            using (NpgsqlDataReader reader = await cmdSelect.ExecuteReaderAsync())
            {
                if (reader.Read())
                {
                    location = new Dictionary<string, object>
                    {
                        { "id", reader["id"] },
                        { "name", reader["name"] },
                    };
                    }
                else
                {
                    return new Dictionary<string, object> { { "error", "Location Type Not Found" } };
                }
            }
            
            var cmdDelete = new NpgsqlCommand("DELETE FROM location_types WHERE id = @id", connection);
            cmdDelete.Parameters.AddWithValue("id", id);
            cmdDelete.ExecuteNonQuery();

            return location;
        }

        public async Task<Dictionary<string, object>> GetTypePaginationAsync(int page, int page_length, bool isNewestFirst, bool sortAlphabetically)
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
                using (NpgsqlCommand countCommand = new NpgsqlCommand("SELECT COUNT(*) FROM location_types", connection))
                {
                    totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
                }

                // Define the sorting order based on isNewestFirst
                string orderBy = ""; 
                if (sortAlphabetically && isNewestFirst)
                {
                    orderBy = "ORDER BY name ASC, created_at DESC";
                }
                else if (sortAlphabetically)
                {
                    orderBy = "ORDER BY name ASC, created_at ASC";
                }
                else if (isNewestFirst)
                {
                    orderBy = "ORDER BY created_at DESC, name DESC";
                }
                else
                {
                    orderBy = "ORDER BY created_at ASC, name DESC";
                }

                // Get paginated rows with sorting
                string query = $@"
                    SELECT id, name, created_at
                    FROM location_types
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
                                { "name", reader["name"] },
                                { "created_at", reader["created_at"]}
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


        public async Task<Dictionary<string, object>> CreateTypeAsync(LocationType location)
        {
            var result = new Dictionary<string, object>();
            if (location == null)
            {
                return new Dictionary<string, object> { { "error", "Bad Request" } };
            }

            // Ensure connection is properly disposed by using 'using' statement
            using (var connection = _connectionFactory.CreateConnection(connectionString))
            {
                await connection.OpenAsync();

                using (NpgsqlCommand countCommand = new NpgsqlCommand("SELECT COUNT(*) FROM location_types WHERE name = @name", connection))
                {
                    countCommand.Parameters.AddWithValue("name", location.Name);
                    var totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());

                    if (totalCount > 0 ) 
                    {
                        result["error"] = "Error: Type already exists";
                        return result;
                    }
                }

                // Use 'using' statement for command as well to ensure proper disposal
                using (var command = new NpgsqlCommand(
                    "INSERT INTO location_types (name) VALUES (@value1) RETURNING id", connection))
                {
                    // Set parameter value and type explicitly
                    command.Parameters.AddWithValue("@value1", location.Name);

                    // Execute command and get the returned value
                    var guidId = (Guid)await command.ExecuteScalarAsync();

                    return new Dictionary<string, object> { { "id", guidId } };
                }
            }
        }


        public async Task<Dictionary<string, object>> GetLocationCountByTypeAsync(Guid id)
        {
            if (id == Guid.Empty || id == null)
            {
                return new Dictionary<string, object> { { "error", "Not Found" } };
            }

            NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString);
            await connection.OpenAsync();
            NpgsqlCommand command = new NpgsqlCommand("SELECT COUNT(*) FROM locations WHERE location_type_id = @id", connection);
            command.Parameters.AddWithValue("id", id);

            var count = await command.ExecuteScalarAsync();
            if (count == null) 
            {
                count = 0;
            }
            return new Dictionary<string, object> { { "count", count } };
                        
        }

        public async Task<Dictionary<string, object>> GetLocationsByTypePaginationAsync(Guid id, int page, int page_length, bool isNewestFirst)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            List<Dictionary<string, object>> locations = new List<Dictionary<string, object>>();
            int totalCount = 0;

            if (id == Guid.Empty)
            {
                return new Dictionary<string, object> { { "error", "Not Found" } };
            }

            if (page_length > 100)
            {
                result["error"] = "Maximum page length exceeded";
                return result;
            }

            using (NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString))
            {
                await connection.OpenAsync();

                using (NpgsqlCommand checkCommand = new NpgsqlCommand(
                    "SELECT name FROM location_types WHERE id = @id", connection))
                {
                    checkCommand.Parameters.AddWithValue("@id", id);
                    var locationTypeName = await checkCommand.ExecuteScalarAsync();
                    
                    if (locationTypeName == null)
                    {
                        result["error"] = "ID not found";
                        return result;
                    }
                }

                using (NpgsqlCommand countCommand = new NpgsqlCommand(
                    @"SELECT COUNT(*) 
                    FROM locations l
                    JOIN location_types lt ON l.location_type_id = lt.id
                    WHERE lt.id = @id", connection))
                {
                    countCommand.Parameters.AddWithValue("@id", id);
                    totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
                }

                string orderBy = isNewestFirst ? "ORDER BY created_at DESC" : "ORDER BY created_at ASC";

                string query = $@"
                    SELECT l.id, l.location_code, l._name, l.description, lt.name as location_type, l.inventory_location, l.parent_id, l.created_at
                    FROM locations l
                    JOIN location_types lt ON l.location_type_id = lt.id
                    WHERE lt.id = @id
                    {orderBy}
                    LIMIT @page_length OFFSET @offset";

                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@id", id);
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
                                { "location_type", reader["location_type"] },
                                { "parent_id", reader["parent_id"] }
                            };
                            locations.Add(location);
                        }
                    }
                }
            }

            result["total_count"] = totalCount;
            result["page"] = page;
            result["page_length"] = page_length;
            result["page_data"] = locations;

            return result;
        }

        public async Task<Dictionary<string, object>> ExportLocationsAsync(int page, int pageLength, bool isNewestFirst)
        {
            Dictionary<string, object> result = new Dictionary<string, object>();

            using (NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString))
            {
                await connection.OpenAsync();

                // Get total count
                using (NpgsqlCommand countCommand = new NpgsqlCommand("SELECT COUNT(*) FROM locations", connection))
                {
                    int totalCount = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
                    int totalPages = (int)Math.Ceiling(totalCount * 1.0 / pageLength);

                    if (page > totalPages)
                    {
                        result["error"] = "Page number exceeds total pages";
                        return result;
                    }
                }

                // Define the sorting order based on isNewestFirst
                string orderBy = isNewestFirst ? "ORDER BY created_at DESC, id DESC" : "ORDER BY created_at ASC, id ASC";

                // Get paginated rows with sorting
                string query = $@"
                    SELECT l.id, l.location_code, l._name, l.description, lt.name as location_type, l.inventory_location, l.parent_id, l.created_at
                    FROM locations l left join location_types lt  on l.location_type_id = lt.id
                    {orderBy}
                    LIMIT @page_length OFFSET @offset";

                using (NpgsqlCommand command = new NpgsqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@page_length", pageLength);
                    command.Parameters.AddWithValue("@offset", (page - 1) * pageLength);

                    using (NpgsqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        var csv = new StringBuilder();
                        csv.AppendLine("Id,Location Code,Name,Description,Inventory Location,Location Type,Parent Id,Created At");
                        while (await reader.ReadAsync())
                        {
                            csv.AppendLine($"{reader["id"]},{reader["location_code"]},{reader["_name"]},{reader["description"]},{reader["inventory_location"]},{reader["location_type"]},{reader["parent_id"]},{reader["created_at"]}");
                        }

                        result["csv_data"] = csv.ToString();
                    }
                }
            }

            return result;
        }
    }

    
}

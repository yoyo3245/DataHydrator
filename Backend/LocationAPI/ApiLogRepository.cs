using Npgsql;
using Newtonsoft.Json;  // Use Newtonsoft.Json for JSON serialization
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LocationAPI
{
    public class ApiLogRepository : IApiLogRepository
    {
        private readonly IDbConnections _connectionFactory;
        public readonly string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=admin;Database=postgres;";

        public ApiLogRepository(IDbConnections connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public static string ConvertDictionaryToJson(object dictionary)
        {
            // Use JsonConvert.SerializeObject from Newtonsoft.Json
            return JsonConvert.SerializeObject(dictionary, Formatting.Indented);
        }

        public async Task<Dictionary<string, int>> LogRequestAsync(string httpType, string endpoint, int statusCode, object body)
        {
            var result = new Dictionary<string, int>();
            string jsonString = ConvertDictionaryToJson(body);

            // Check if httpType or endpoint are null or empty
            if (string.IsNullOrEmpty(httpType) || string.IsNullOrEmpty(endpoint))
            {
                return new Dictionary<string, int>();
            }

            // Check if statusCode is not a valid code (assuming valid codes are in a certain range, like 100-599)
            if (statusCode < 100 || statusCode > 599)
            {
                return new Dictionary<string, int>();
            }

            using (NpgsqlConnection connection = _connectionFactory.CreateConnection(connectionString))
            {
                await connection.OpenAsync();

                using (NpgsqlCommand command = new NpgsqlCommand(
                    "INSERT INTO api_logs (http_method, endpoint, response_status, response_body) " +
                    "VALUES (@httpType, @endpoint, @statusCode, @body) RETURNING id", connection))
                {
                    command.Parameters.AddWithValue("@httpType", httpType);
                    command.Parameters.AddWithValue("@endpoint", endpoint);
                    command.Parameters.AddWithValue("@statusCode", statusCode);
                    command.Parameters.AddWithValue("@body", jsonString);

                    // Execute the command and retrieve the generated ID
                    int id = (int)await command.ExecuteScalarAsync();
                    result.Add("id", id);
                }
            }

            return result;
        }
    }
}

using Npgsql;

namespace LocationAPI
{
    public class DbConnections : IDbConnections
    {
        public NpgsqlConnection CreateConnection(string connectionString)
        {
            return new NpgsqlConnection(connectionString);
        }
    }
}

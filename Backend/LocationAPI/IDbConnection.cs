using Npgsql;

namespace LocationAPI
{
    public interface IDbConnections
    {
        public NpgsqlConnection CreateConnection(string connectionString);
    }
}

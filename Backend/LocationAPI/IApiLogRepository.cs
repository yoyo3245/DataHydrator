namespace LocationAPI
{
    public interface IApiLogRepository
    {
        public Task<Dictionary<string, int>> LogRequestAsync(string httpType, string endpoint, int statusCode, object body);
    }
}

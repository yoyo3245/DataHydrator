namespace LocationAPI
{
    public interface ILocationRepository
    {
        public Task<Dictionary<string, object>> UpdateLocationAsync(Guid id, LocationUpdate updatedLocation);
        public Task<Dictionary<string, object>> DeleteLocationAsync(Guid id);
        public Task<List<Dictionary<string, object>>> GetAllLocationsAsync();
        public Task<Dictionary<string, Guid>> CreateLocationAsync(Location location);
        public Task<Dictionary<string, object>> GetLocationAsync(Guid id);
        public Task<Dictionary<string, object>> GetPaginationAsync(int page, int page_length, bool isNewestFirst);
        public Task<List<Dictionary<string, object>>> GetAllLocationTypesAsync();
        public Task<Dictionary<string, object>> DeleteLocationTypeAsync(Guid id);
        public Task<Dictionary<string, object>> GetTypePaginationAsync(int page, int pageLength, bool isNewestFirst);
        public Task<Dictionary<string, Guid>> CreateTypeAsync(LocationType location);
        public Task<Dictionary<string, object>> GetLocationsByTypePaginationAsync(Guid id, int page, int pageLength, bool isNewestFirst);
    }
}
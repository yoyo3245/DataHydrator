namespace LocationAPI
{
    public class LocationUpdate
    {
        public string? LocationCode { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Guid? LocationId { get; set; }
        public bool? InventoryLocation { get; set; }
        public Guid? ParentId { get; set; }
    }
}
namespace LocationAPI
{
    public class Location
    {
        public string LocationCode { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public LocationType LocationType { get; set; }
        public bool InventoryLocation { get; set; }
        public Guid ParentId { get; set; }
    }
}

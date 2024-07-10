using Microsoft.AspNetCore.Mvc;
using Moq;
using LocationAPI;
using LocationAPI.Controllers;

namespace LocationApiTests
{
    public class Tests
    {
        private Mock<IDbConnections> mockConnectionFactory;
        private Mock<ILocationRepository> mockLocationRepository;

        [SetUp]
        public void Setup()
        {
            mockConnectionFactory = new Mock<IDbConnections>();
            mockLocationRepository = new Mock<ILocationRepository>();
        }

        [Test]
        public async Task DeleteLocation_ReturnOkAsync()
        {
            Guid id = Guid.Parse("9661ea2e-8bef-4441-b9a9-cbb4570de657");
            Guid parentId = Guid.Parse("d65ff2c0-09d7-4d75-b4bc-72f1c2768b77");

            var expectedLocation = new Dictionary<string, object>
            {
                { "id", id },
                { "location_code", "TestCode" },
                { "name", "TestName" },
                { "description", "TestDescription" },
                { "inventory_location", true },
                { "region", 0 },
                { "site", 0 },
                { "parent_id", parentId }
            };

            mockLocationRepository.Setup(x => x.DeleteLocationAsync(It.IsAny<Guid>())).ReturnsAsync(expectedLocation);

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.DeleteLocation(id);
            Assert.IsInstanceOf<OkObjectResult>(result);

            var okResult = result as OkObjectResult;
            Assert.IsNotNull(okResult); // Ensure that the cast was successful
            Assert.AreEqual(200, okResult.StatusCode);

            var responseData = okResult.Value as Dictionary<string, object>;
            Assert.IsNotNull(responseData);
            Assert.AreEqual(expectedLocation, responseData);
        }

        [Test]
        public async Task DeleteLocation_ReturnNotFound()
        {
            Guid id = Guid.Parse("9661ea2e-8bef-4441-b9a9-cbb4570de657");
            
            mockLocationRepository.Setup(x => x.DeleteLocationAsync(It.IsAny<Guid>())).ReturnsAsync(new Dictionary<string, object>());

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.DeleteLocation(id);
            Assert.IsInstanceOf<NotFoundResult>(result);

            var notFoundResult = result as NotFoundResult;
            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

        
        [Test]
        public async Task GetLocation_ReturnOk()
        {
            Guid id = Guid.Parse("58b849f4-b5ee-4b29-bf80-736305ffcf5a");
            Guid parentId = Guid.Parse("fc303b08-0b59-431b-b6af-382295a33930");

            var expectedLocation = new Dictionary<string, object>
            {
                { "id", id },
                { "location_code", "TestCode" },
                { "name", "TestName" },
                { "description", "TestDescription" },
                { "inventory_location", true },
                { "region", 0 },
                { "site", 0 },
                { "parent_id", parentId }
            };

            mockLocationRepository.Setup(x => x.GetLocationAsync(It.IsAny<Guid>())).ReturnsAsync(expectedLocation);

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.GetLocation(id);
            Assert.IsInstanceOf<OkObjectResult>(result);

            var okResult = result as OkObjectResult;
            Assert.AreEqual(200, okResult.StatusCode);

            var responseData = okResult.Value as Dictionary<string, object>;
            Assert.IsNotNull(responseData);

            Assert.AreEqual(expectedLocation, responseData);

        }

        [Test]
        public async Task GetLocation_ReturnNotFound()
        {
            Guid id = Guid.Parse("58b849f4-b5ee-4b29-bf80-736305ffcf5a");

            mockLocationRepository.Setup(x => x.GetLocationAsync(It.IsAny<Guid>())).ReturnsAsync(new Dictionary<string, object>());

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.GetLocation(id);
            Assert.IsInstanceOf<NotFoundResult>(result);

            var notFoundResult = result as NotFoundResult;
            Assert.AreEqual(404, notFoundResult.StatusCode);

        }

        [Test]
        public async Task CreateLocation_ReturnOk()
        {
            Guid id = Guid.Parse("58b849f4-b5ee-4b29-bf80-736305ffcf5a");
            Guid parentId = Guid.Parse("fc303b08-0b59-431b-b6af-382295a33930");

            var location = new Location
            {
                LocationCode = "TestCode",
                Name = "TestName",
                Description = "TestDescription",
                InventoryLocation = true,
                LocationType = 0,
                ParentId = parentId
            };

            var expectedLocation = new Dictionary<string, Guid>
            {
                { "id", id }
            };

            mockLocationRepository.Setup(x => x.CreateLocationAsync(It.IsAny<Location>())).ReturnsAsync(expectedLocation);

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.CreateLocation(location);

            Assert.IsInstanceOf<OkObjectResult>(result);
            
            var okResult = result as OkObjectResult;
            var responseData = okResult.Value as Dictionary<string, Guid>;

            Assert.AreEqual(200, okResult.StatusCode);
            Assert.IsTrue(responseData["id"] is Guid);
        }

        [Test]
        public async Task CreateLocation_ReturnBadRequestAsync()
        {
            mockLocationRepository.Setup(x => x.CreateLocationAsync(It.IsAny<Location>())).ReturnsAsync(new Dictionary<string, Guid>());

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.CreateLocation(null);
            Assert.IsInstanceOf<BadRequestResult>(result);

            var badRequestResult = result as BadRequestResult;
            Assert.AreEqual(400, badRequestResult.StatusCode);

        }

        [Test]
        public async Task GetAllLocations_ReturnOkAsync()
        {
            Guid id = Guid.Parse("58b849f4-b5ee-4b29-bf80-736305ffcf5a");
            Guid parentId = Guid.Parse("fc303b08-0b59-431b-b6af-382295a33930");

            var expectedLocations = new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    { "id", id },
                    { "location_code", "TestCode1" },
                    { "name", "TestName1" },
                    { "description", "TestDescription1" },
                    { "inventory_location", true },
                    { "region", 0 },
                    { "site", 0 },
                    { "parent_id", parentId }
                },
                new Dictionary<string, object>
                {
                    { "id", id },
                    { "location_code", "TestCode2" },
                    { "name", "TestName2" },
                    { "description", "TestDescription2" },
                    { "inventory_location", true },
                    { "region", 0 },
                    { "site", 0 },
                    { "parent_id", parentId }
                }
            };

            mockLocationRepository.Setup(x => x.GetAllLocationsAsync()).ReturnsAsync(expectedLocations);

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.GetAllLocations();
            Assert.IsInstanceOf<OkObjectResult>(result);

            var okResult = result as OkObjectResult;
            Assert.AreEqual(200, okResult.StatusCode);

            var responseData = okResult.Value as List<Dictionary<string, object>>;
            Assert.IsNotNull(responseData);

            Assert.AreEqual(expectedLocations, responseData);

        }

        [Test]
        public async Task GetAllLocations_ReturnNotFoundAsync()
        {
            var expectedLocations = new List<Dictionary<string, object>>();

            mockLocationRepository.Setup(x => x.GetAllLocationsAsync()).ReturnsAsync(expectedLocations);

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.GetAllLocations();
            Assert.IsInstanceOf<NotFoundResult>(result);

            var notFoundResult = result as NotFoundResult;
            Assert.AreEqual(404, notFoundResult.StatusCode);

        }

        [Test]
        public async Task UpdateLocation_ReturnOkAsync()
        {
            Guid id = Guid.Parse("58b849f4-b5ee-4b29-bf80-736305ffcf5a");
            Guid parentId = Guid.Parse("fc303b08-0b59-431b-b6af-382295a33930");

            var locationUpdate = new LocationUpdate
            {
                LocationCode = "TestCode",
                Name = "TestName",
                Description = "TestDescription"
            };

            var expectedLocation = new Dictionary<string, object>
            {
                { "id", id },
                { "location_code", "TestCode" },
                { "name", "TestName" },
                { "description", "TestDescription" },
                { "inventory_location", true },
                { "region", 0 },
                { "site", 0 },
                { "parent_id", parentId }
            };

            mockLocationRepository.Setup(x => x.UpdateLocationAsync(It.IsAny<Guid>(), It.IsAny<LocationUpdate>())).ReturnsAsync(expectedLocation);

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.UpdateLocation(id, locationUpdate);

            Assert.IsInstanceOf<OkObjectResult>(result);

            var okResult = result as OkObjectResult;
            var responseData = okResult.Value as Dictionary<string, object>;

            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(expectedLocation, responseData);
        }

        [Test]
        public async Task UpdateLocation_ReturnNotFoundAsync()
        {
            Guid id = Guid.Parse("58b849f4-b5ee-4b29-bf80-736305ffcf5a");
            Guid parentId = Guid.Parse("fc303b08-0b59-431b-b6af-382295a33930");

            var locationUpdate = new LocationUpdate
            {
                LocationCode = "TestCode",
                Name = "TestName",
                Description = "TestDescription"
            };

            var expectedLocation = new Dictionary<string, object>
            {
                { "id", id },
                { "location_code", "TestCode" },
                { "name", "TestName" },
                { "description", "TestDescription" },
                { "inventory_location", true },
                { "region", 0 },
                { "site", 0 },
                { "parent_id", parentId }
            };

            mockLocationRepository.Setup(x => x.UpdateLocationAsync(It.IsAny<Guid>(), It.IsAny<LocationUpdate>())).ReturnsAsync(new Dictionary<string, object>());

            var controller = new LocationsController(mockLocationRepository.Object);

            var result = await controller.UpdateLocation(id, locationUpdate);

            Assert.IsInstanceOf<NotFoundResult>(result);

            var notFoundResult = result as NotFoundResult;

            Assert.AreEqual(404, notFoundResult.StatusCode);
        }

    }
}
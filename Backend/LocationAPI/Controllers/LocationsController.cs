using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Text.Json;


namespace LocationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationRepository locationRepository;

        public LocationsController(ILocationRepository locationRepository)
        {
            this.locationRepository = locationRepository;
        }

        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateLocation(Guid id, [FromBody] LocationUpdate updatedLocation)
        {
            var location = await locationRepository.UpdateLocationAsync(id, updatedLocation);

            if (location.Count != 0)
            {
                return Ok(location);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteLocation(Guid id)
        {
            var location = await locationRepository.DeleteLocationAsync(id);

            if (location.Count != 0)
            {
                return Ok(location);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLocations()
        {
            var allLocations = await locationRepository.GetAllLocationsAsync();

            if (allLocations.Count != 0)
            {
                var json = JsonSerializer.Serialize(allLocations);
                return Ok(json);
            }
            else
            {
                return NotFound();
            }
        }

    

        [HttpPost]
        public async Task<IActionResult> CreateLocation([FromBody] Location location)
        {
            var id = await locationRepository.CreateLocationAsync(location);

            if (id.Count != 0)
            {
                return Ok(id);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetLocation(Guid id)
        {
            var location = await locationRepository.GetLocationAsync(id);

            if (location.Count != 0)
            {
                return Ok(location);
            }
            else
            {
                return NotFound();
            }
        }
//item?page=1&pageLength=20&isNewestFirst=true
        [HttpGet]
        [Route("items")]
        public async Task<IActionResult> GetPagination(
            [FromQuery] int page = 1,
            [FromQuery] int pageLength = 10,
            [FromQuery] bool isNewestFirst = false) 
        {
            var result = await locationRepository.GetPaginationAsync(page, pageLength, isNewestFirst);

            if (result.ContainsKey("error"))
            {
                return BadRequest(result);
            }
            else 
            {
                return Ok(result);
            }
        }
    }
}

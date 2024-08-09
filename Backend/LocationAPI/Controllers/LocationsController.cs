using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Text;
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

        [HttpDelete]
        [Route("types/{id}")]
        public async Task<IActionResult> DeleteLocationType(Guid id)
        {
            var location = await locationRepository.DeleteLocationTypeAsync(id);

            if (location.Count != 0)
            {
                return Ok(location);
            }
            else
            {
                return NotFound(location);
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

        [HttpGet]
        [Route("types")]
        public async Task<IActionResult> GetAllTypes()
        {
            var allTypes = await locationRepository.GetAllLocationTypesAsync();

            if (allTypes.Count != 0)
            {
                var json = JsonSerializer.Serialize(allTypes);
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

        [HttpGet]
        [Route("types/items")]
        public async Task<IActionResult> GetTypePagination(
            [FromQuery] int page, 
            [FromQuery] int pageLength = 10,
            [FromQuery] bool isNewestFirst = false, 
            [FromQuery] bool sortAlphabetically = true)
            {
                var result = await locationRepository.GetTypePaginationAsync(page, pageLength, isNewestFirst, sortAlphabetically);

                if (result.ContainsKey("error"))
                {
                    return BadRequest(result);
                }
                else 
                {
                    return Ok(result);
                }
            }

        [HttpPost]
        [Route("types")]
        public async Task<IActionResult> CreateType([FromBody] LocationType location)
        {
            var response = await locationRepository.CreateTypeAsync(location);

            if (response.ContainsKey("error"))
            {
                return Ok(response);
            }
            else
            {
                return BadRequest(response);
            }
        }

        // [HttpGet]
        // [Route("types/{id}")]
        // public async Task<IActionResult> GetLocationCountByType(Guid id)
        // {
        //     var response = await locationRepository.GetLocationCountByTypeAsync(id);

        //     if (response.Count != 0)
        //     {
        //         return Ok(response);
        //     }
        //     else
        //     {
        //         return NotFound();
        //     }
        // }

        [HttpGet]
        [Route("types/{id}/items")]
        public async Task<IActionResult> GetLocationsByTypePaginationAsync(
            Guid id,
            [FromQuery] int page, 
            [FromQuery] int pageLength = 10,
            [FromQuery] bool isNewestFirst = false)
            {
                var result = await locationRepository.GetLocationsByTypePaginationAsync(id, page, pageLength, isNewestFirst);

                if (result.ContainsKey("error"))
                {
                    return NotFound(result);
                }
                else 
                {
                    return Ok(result);
                }
            }

        
        [HttpGet]
        [Route("export")]
        public async Task<IActionResult> ExportLocations(
            [FromQuery] int page,
            [FromQuery] int pageLength = 10,
            [FromQuery] bool isNewestFirst = false)
        {
            var result = await locationRepository.ExportLocationsAsync(page, pageLength, isNewestFirst);

            if (result.ContainsKey("error"))
            {
                return BadRequest(result);
            }
            else
            {
                return File(Encoding.UTF8.GetBytes((string)result["csv_data"]), "text/csv", "locations.csv");
            }
        }
    }
}

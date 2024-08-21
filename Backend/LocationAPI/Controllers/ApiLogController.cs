using Microsoft.AspNetCore.Mvc;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;

namespace LocationAPI.Controllers
{
    [ApiController]
    [Route("api/log")]
    public class ApiLogController : ControllerBase
    {
        private readonly IApiLogRepository apiLogRepository;

        public ApiLogController(IApiLogRepository apiLogRepository)
        {
            this.apiLogRepository = apiLogRepository;
        }

        //[HttpPost]
        //public async Task<IActionResult> UpdateLocation(Guid id, [FromBody] LocationUpdate updatedLocation)
        //{
        //    var location = await locationRepository.UpdateLocationAsync(id, updatedLocation);

        //    if (location.Count != 0)
        //    {
        //        await apiLogRepository.LogRequestAsync("PUT", $"/api/locations/{id}/", 200, location);
        //        return Ok(location);
        //    }
        //    else
        //    {
        //        await apiLogRepository.LogRequestAsync("PUT", $"/api/locations/{id}/", 404, location);
        //        return NotFound();
        //    }
        //}
    }
}

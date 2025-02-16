using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;

namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MainCategoryController : ControllerBase
    {
        private readonly JsonFileService<MainCategory> _jsonFileService;

        public MainCategoryController(JsonFileService<MainCategory> jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        [HttpGet]
        public async Task<ActionResult<List<MainCategory>>> GetMainCategories()
        {
            var mainCategories = await _jsonFileService.ReadAsync();
            return Ok(mainCategories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MainCategory>> GetMainCategory(string id)
        {
            var mainCategories = await _jsonFileService.ReadAsync();
            var mainCategory = mainCategories.FirstOrDefault(mc => mc.Id == id);
            if (mainCategory == null)
            {
                return NotFound();
            }
            return Ok(mainCategory);
        }

        [HttpPost]
        public async Task<ActionResult<MainCategory>> CreateMainCategory(MainCategory mainCategory)
        {
            var mainCategories = await _jsonFileService.ReadAsync();
            mainCategories.Add(mainCategory);
            await _jsonFileService.WriteAsync(mainCategories);
            return CreatedAtAction(nameof(GetMainCategory), new { id = mainCategory.Id }, mainCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMainCategory(string id, MainCategory updatedMainCategory)
        {
            var mainCategories = await _jsonFileService.ReadAsync();
            var mainCategoryIndex = mainCategories.FindIndex(mc => mc.Id == id);
            if (mainCategoryIndex == -1)
            {
                return NotFound();
            }
            mainCategories[mainCategoryIndex] = updatedMainCategory;
            await _jsonFileService.WriteAsync(mainCategories);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMainCategory(string id)
        {
            var mainCategories = await _jsonFileService.ReadAsync();
            var mainCategoryIndex = mainCategories.FindIndex(mc => mc.Id == id);
            if (mainCategoryIndex == -1)
            {
                return NotFound();
            }
            mainCategories.RemoveAt(mainCategoryIndex);
            await _jsonFileService.WriteAsync(mainCategories);
            return NoContent();
        }
    }
}

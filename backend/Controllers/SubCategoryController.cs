using Microsoft.AspNetCore.Mvc;
using SkillwaveAPI.Services;
using SkillwaveAPI.Models;

namespace SkillwaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SubCategoryController : ControllerBase
    {
        private readonly JsonFileService<SubCategory> _jsonFileService;

        public SubCategoryController(JsonFileService<SubCategory> jsonFileService)
        {
            _jsonFileService = jsonFileService;
        }

        [HttpGet]
        public async Task<ActionResult<List<SubCategory>>> GetSubCategories()
        {
            var subCategories = await _jsonFileService.ReadAsync();
            return Ok(subCategories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategory>> GetSubCategory(string id)
        {
            var subCategories = await _jsonFileService.ReadAsync();
            var subCategory = subCategories.FirstOrDefault(sc => sc.Id == id);
            if (subCategory == null)
            {
                return NotFound();
            }
            return Ok(subCategory);
        }

        [HttpPost]
        public async Task<ActionResult<SubCategory>> CreateSubCategory(SubCategory subCategory)
        {
            var subCategories = await _jsonFileService.ReadAsync();
            subCategories.Add(subCategory);
            await _jsonFileService.WriteAsync(subCategories);
            return CreatedAtAction(nameof(GetSubCategory), new { id = subCategory.Id }, subCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubCategory(string id, SubCategory updatedSubCategory)
        {
            var subCategories = await _jsonFileService.ReadAsync();
            var subCategoryIndex = subCategories.FindIndex(sc => sc.Id == id);
            if (subCategoryIndex == -1)
            {
                return NotFound();
            }
            subCategories[subCategoryIndex] = updatedSubCategory;
            await _jsonFileService.WriteAsync(subCategories);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubCategory(string id)
        {
            var subCategories = await _jsonFileService.ReadAsync();
            var subCategoryIndex = subCategories.FindIndex(sc => sc.Id == id);
            if (subCategoryIndex == -1)
            {
                return NotFound();
            }
            subCategories.RemoveAt(subCategoryIndex);
            await _jsonFileService.WriteAsync(subCategories);
            return NoContent();
        }
    }
}

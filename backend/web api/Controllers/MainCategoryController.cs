using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//using web_api.Data;
using web_api.Models;

namespace SkillWaveAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MainCategoryController : ControllerBase
    {
        private readonly SkillWaveDbContext _context;

        public MainCategoryController(SkillWaveDbContext context)
        {
            _context = context;
        }

        // GET: api/MainCategory
        [HttpGet]
        public async Task<IActionResult> GetAllMainCategories()
        {
            var categories = await _context.MainCategories
                                           .Include(mc => mc.SubCategories)
                                           .ToListAsync();
            return Ok(categories);
        }

        // GET: api/MainCategory/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMainCategoryById(int id)
        {
            var category = await _context.MainCategories
                                         .Include(mc => mc.SubCategories)
                                         .FirstOrDefaultAsync(mc => mc.MainCategoryID == id);

            if (category == null)
                return NotFound($"MainCategory with ID {id} not found.");

            return Ok(category);
        }

        // POST: api/MainCategory
        [HttpPost]
        public async Task<IActionResult> CreateMainCategory([FromBody] MainCategory mainCategory)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data.");

            _context.MainCategories.Add(mainCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMainCategoryById), new { id = mainCategory.MainCategoryID }, mainCategory);
        }

        // PUT: api/MainCategory/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMainCategory(int id, [FromBody] MainCategory updatedCategory)
        {
            var category = await _context.MainCategories.FindAsync(id);

            if (category == null)
                return NotFound($"MainCategory with ID {id} not found.");

            category.Name = updatedCategory.Name;

            _context.MainCategories.Update(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/MainCategory/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMainCategory(int id)
        {
            var category = await _context.MainCategories.FindAsync(id);

            if (category == null)
                return NotFound($"MainCategory with ID {id} not found.");

            _context.MainCategories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

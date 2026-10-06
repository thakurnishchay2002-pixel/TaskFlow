from pathlib import Path
required = [
"frontend/src/App.jsx","frontend/src/components/TaskForm.jsx","frontend/src/hooks/useTasks.js",
"frontend/src/services/api.js","frontend/src/pages/Dashboard.jsx","frontend/src/pages/Tasks.jsx",
"backend/src/main/java/com/taskflow/controller/TaskController.java",
"backend/src/main/java/com/taskflow/service/TaskService.java",
"backend/src/main/java/com/taskflow/repository/TaskRepository.java",
"backend/src/main/java/com/taskflow/entity/Task.java",
"backend/src/main/java/com/taskflow/exception/GlobalExceptionHandler.java",
"docker-compose.yml","README.md",".gitignore"
]
root=Path(__file__).resolve().parents[1]
missing=[x for x in required if not (root/x).exists()]
assert not missing, f"Missing: {missing}"
text=(root/"backend/src/main/java/com/taskflow/controller/TaskController.java").read_text()
assert "@RequestMapping(\"/api/tasks\")" in text
assert all(x in text for x in ["@GetMapping","@PostMapping","@PutMapping","@PatchMapping","@DeleteMapping"])
service=(root/"backend/src/main/java/com/taskflow/service/TaskService.java").read_text()
assert "Specification<Task>" in service and "DeadlineFilter" in service
print("Project structure verification: PASS")

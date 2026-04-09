# Task 12.3: Dynamic Child Pipelines

## Goal

Create an interactive visualization of the generation and execution of a dynamic child pipeline. Show the two-stage process: first the generate job creates YAML, then the trigger job launches it.

## Requirements

1. Display a list of services in the `services/` directory — the user can add and remove services
2. Show the generate job that "generates" YAML based on the service list
3. Display the generated YAML — it should contain one job per service
4. Show the trigger job referencing `artifact: generated-pipeline.yml`
5. Visualize the resulting dynamic child pipeline with jobs for each service
6. On adding or removing a service — recalculate and update the generated YAML

## Checklist

- [ ] Service list with ability to add (input field + button) and remove (button per service)
- [ ] "generate-pipeline" block with generation icon
- [ ] Text area (readonly) with generated YAML — updates when service list changes
- [ ] "trigger-dynamic" block with include:artifact config
- [ ] Child pipeline visualization: separate block with job list
- [ ] YAML for generate job (artifacts:paths) and trigger job (trigger:include:artifact)
- [ ] Warning when service list is empty

## How to Verify

1. Add a service `payments` — verify a `test-payments` job appears in generated YAML
2. Remove service `frontend` — `test-frontend` job should disappear from YAML
3. Add 5+ services — YAML should correctly contain all jobs
4. Clear the service list — a warning "No services to generate" should appear
5. Check that the trigger job config doesn't change when the service list changes (it always references the artifact)

## Hints

- Use `useState` for: `services` (array of strings), `newServiceName` (input field string)
- Implement YAML generation as a function `generateYaml(services: string[]): string` that builds a template literal
- For each service generate a job: `test-{service}: { stage: test, script: ["cd services/{service} && npm test"] }`
- Minimal valid YAML for child: `stages: [test]` + one job per service
- For the warning on empty list use conditional rendering

import { Dumbbell, ListChecks } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getInitialWorkout, workouts } from "./data/workouts.js";

const formatPrescription = (exercise) => {
  const reps = exercise.reps.includes("ripetizioni") ? exercise.reps : `${exercise.reps} ripetizioni`;
  return `${exercise.sets} serie · ${reps}`;
};

function App() {
  const [activeWorkoutId, setActiveWorkoutId] = useState(getInitialWorkout().id);
  const activeWorkout = workouts.find((workout) => workout.id === activeWorkoutId) ?? workouts[0];
  const [activeExerciseId, setActiveExerciseId] = useState(activeWorkout.exercises[0].id);
  const detailRef = useRef(null);

  useEffect(() => {
    setActiveExerciseId(activeWorkout.exercises[0].id);
  }, [activeWorkout]);

  const activeExercise = useMemo(() => {
    return (
      activeWorkout.exercises.find((exercise) => exercise.id === activeExerciseId) ??
      activeWorkout.exercises[0]
    );
  }, [activeExerciseId, activeWorkout]);

  const selectExercise = (exerciseId) => {
    setActiveExerciseId(exerciseId);
    if (window.matchMedia("(max-width: 700px)").matches) {
      window.requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }
  };

  return (
    <div className="guide-shell">
      <aside className="guide-sidebar" aria-label="Selezione allenamento">
        <div className="brand">
          <span className="brand-mark">
            <Dumbbell size={20} strokeWidth={2.4} />
          </span>
          <div>
            <strong>Guida Allenamento</strong>
            <p>Scheda A / B / C</p>
          </div>
        </div>

        <nav className="workout-tabs">
          {workouts.map((workout) => (
            <button
              key={workout.id}
              className={workout.id === activeWorkoutId ? "workout-tab active" : "workout-tab"}
              type="button"
              onClick={() => setActiveWorkoutId(workout.id)}
              style={{ "--accent": workout.accent }}
            >
              <strong>{workout.label}</strong>
              <span>{workout.focus}</span>
              <em>{workout.exercises.length} esercizi</em>
            </button>
          ))}
        </nav>
      </aside>

      <main className="guide-main">
        <header className="guide-header">
          <div>
            <p>{activeWorkout.subtitle}</p>
            <h1>{activeWorkout.label}</h1>
          </div>
          <div className="header-count">
            <ListChecks size={18} />
            {activeWorkout.exercises.length} esercizi
          </div>
        </header>

        <div className="guide-layout">
          <section className="exercise-list" aria-label={`${activeWorkout.label} esercizi`}>
            {activeWorkout.exercises.map((exercise, index) => (
              <button
                key={exercise.id}
                className={exercise.id === activeExercise.id ? "exercise-card active" : "exercise-card"}
                type="button"
                onClick={() => selectExercise(exercise.id)}
              >
                <img src={exercise.image} alt="" />
                <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="exercise-summary">
                  <strong>{exercise.shortTitle}</strong>
                  <small>{formatPrescription(exercise)}</small>
                </span>
              </button>
            ))}
          </section>

          <article className="exercise-detail" ref={detailRef}>
            <div className="poster-frame">
              <img src={activeExercise.image} alt={activeExercise.title} />
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

export default App;

"use client";
import { motion } from "motion/react";
import { Award, BookOpen } from "lucide-react";

export const educationHistory = [
  {
    university: "Petra Christian University",
    degree: "Bachelor of Computer Science",
    gradYear: "2026",
    gpa: "3.77 / 4.00",
    coursework: [
      "Data Analytics",
      "Data Visualization & Communication",
      "Statistics & Probability",
      "Machine Learning & Data Mining",
      "Relational Databases & SQL",
      "Software Engineering",
      "Cloud Computing & DevOps",
    ],
  },
  {
    university: "Royal Melbourne Institute of Technology (RMIT University)",
    degree: "Project Management Concepts Summer School Program",
    gradYear: "2021",
    coursework: [
      "Project Lifecycle & Planning",
      "Risk Management & Mitigation",
      "Stakeholder Engagement",
      "Project Scheduling & Budgeting",
      "Resource & Team Management",
    ],
  },
];

export default function Education() {
  return (
    <section
      className="py-24 border-t border-zinc-100 bg-transparent text-zinc-900 max-w-2xl mx-auto px-4 sm:px-6"
      id="education"
    >
      <div className="w-full">
        <div className="border-b border-zinc-200 pb-6 mb-12">
          <h3 className="font-display font-medium text-3xl md:text-4xl text-zinc-900 tracking-tight mt-1">
            Education
          </h3>
        </div>

        <div className="flex flex-col gap-16">
          {educationHistory.map((edu, eduIndex) => (
            <motion.div
              key={eduIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: eduIndex * 0.1 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 rounded transition-all duration-300"
              id={`education-details-card-${eduIndex}`}
            >
              <div className="md:col-span-12 flex flex-col justify-between">
                <div>
                  {/* FLIPPED: University is now the prominent heading */}
                  <h4 className="font-display font-medium text-2xl md:text-3xl text-zinc-900 tracking-tight leading-snug">
                    {edu.university}
                  </h4>

                  {/* FLIPPED: Degree is now the subtext */}
                  <p className="font-sans text-lg text-zinc-600 mt-2">
                    {edu.degree}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Award size={14} className="text-zinc-400" />
                    <span>Class of {edu.gradYear}</span>
                  </div>

                  {/* Optional GPA Container */}
                  {edu.gpa && (
                    <div className="flex items-center gap-1.5 border-l border-zinc-200 pl-6">
                      <span>GPA:</span>
                      <span className="text-zinc-900 font-bold">{edu.gpa}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Coursework Block */}
              <div className="md:col-span-12 border-t border-zinc-200 pt-8 mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={14} className="text-zinc-400" />
                  <h5 className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                    Core Coursework
                  </h5>
                </div>

                <div
                  className="flex flex-wrap gap-2"
                  id={`coursework-tags-${eduIndex}`}
                >
                  {edu.coursework.map((course, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="px-3 py-1.5 bg-zinc-50 text-zinc-700 font-mono text-xs rounded hover:bg-zinc-100 hover:text-zinc-900 transition-colors cursor-default border border-zinc-200"
                    >
                      {course}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

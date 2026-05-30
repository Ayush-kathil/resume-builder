import { create } from 'zustand';
import { ResumeData, initialResumeData, PersonalInfo, Experience, Education, Skill, Project } from '@/types/resume';
import { sanitizeText } from '@/lib/techDictionary';

interface ResumeState {
  data: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setResumeData: (data: ResumeData) => void;
  selectedTemplate: string;
  setTemplate: (template: string) => void;
  targetJobKeywords: string;
  setTargetJobKeywords: (keywords: string) => void;
  setSectionOrder: (order: string[]) => void;
  careerGrade: 'Entry' | 'Professional' | 'Executive';
  setCareerGrade: (grade: 'Entry' | 'Professional' | 'Executive') => void;
  sanitizeData: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  data: initialResumeData,
  selectedTemplate: 'classic',
  careerGrade: 'Professional',
  setCareerGrade: (grade) => set({ careerGrade: grade }),
  setTemplate: (template) => set({ selectedTemplate: template }),
  targetJobKeywords: '',
  setTargetJobKeywords: (keywords) => set({ targetJobKeywords: keywords }),
  updatePersonalInfo: (info) =>
    set((state) => ({
      data: {
        ...state.data,
        personalInfo: { ...state.data.personalInfo, ...info },
      },
    })),
  addExperience: (exp) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: [...state.data.experience, exp],
      },
    })),
  updateExperience: (id, updatedExp) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.map((exp) =>
          exp.id === id ? { ...exp, ...updatedExp } : exp
        ),
      },
    })),
  removeExperience: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        experience: state.data.experience.filter((exp) => exp.id !== id),
      },
    })),
  addEducation: (edu) =>
    set((state) => ({
      data: {
        ...state.data,
        education: [...state.data.education, edu],
      },
    })),
  updateEducation: (id, updatedEdu) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.map((edu) =>
          edu.id === id ? { ...edu, ...updatedEdu } : edu
        ),
      },
    })),
  removeEducation: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        education: state.data.education.filter((edu) => edu.id !== id),
      },
    })),
  addSkill: (skill) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: [...state.data.skills, skill],
      },
    })),
  updateSkill: (id, updatedSkill) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.map((skill) =>
          skill.id === id ? { ...skill, ...updatedSkill } : skill
        ),
      },
    })),
  removeSkill: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        skills: state.data.skills.filter((skill) => skill.id !== id),
      },
    })),
  addProject: (project) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: [...state.data.projects, project],
      },
    })),
  updateProject: (id, updatedProject) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.map((project) =>
          project.id === id ? { ...project, ...updatedProject } : project
        ),
      },
    })),
  removeProject: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        projects: state.data.projects.filter((project) => project.id !== id),
      },
    })),
  setSectionOrder: (order) =>
    set((state) => ({
      data: {
        ...state.data,
        sectionOrder: order,
      },
    })),
  setResumeData: (data) => set({ data }),
  sanitizeData: () => set((state) => {
    const newData = { ...state.data };

    newData.experience = (newData.experience || []).map(exp => ({
      ...exp,
      description: (exp.description || []).map(d => sanitizeText(d))
    }));

    newData.projects = (newData.projects || []).map(proj => ({
      ...proj,
      description: sanitizeText(proj.description),
      technologies: (proj.technologies || []).map(t => sanitizeText(t))
    }));

    newData.skills = (newData.skills || []).map(skill => ({
      ...skill,
      items: (skill.items || []).map(s => sanitizeText(s))
    }));

    return { data: newData };
  }),
}));

import { create } from 'zustand';
import { ResumeData, initialResumeData, PersonalInfo, Experience, Education, Skill, Project } from '@/types/resume';
import { sanitizeText } from '@/lib/techDictionary';

export interface ThemeConfig {
  accentColor: string;
  fontFamily: 'serif' | 'sans';
}

interface ResumeState {
  data: ResumeData;
  themeConfig: ThemeConfig;
  setThemeConfig: (config: Partial<ThemeConfig>) => void;
  
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

  targetJobKeywords: string;
  setTargetJobKeywords: (keywords: string) => void;
  targetJobDescription: string;
  setTargetJobDescription: (jd: string) => void;
  setSectionOrder: (order: string[]) => void;
  careerGrade: 'Fresher' | 'Intermediate' | 'Senior' | 'Super Senior';
  setCareerGrade: (grade: 'Fresher' | 'Intermediate' | 'Senior' | 'Super Senior') => void;
  activeAiEditField: string | null;
  setActiveAiEditField: (field: string | null) => void;
  sanitizeData: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  activeAccordion: string;
  setActiveAccordion: (accordion: string) => void;
  atsViewMode: boolean;
  setAtsViewMode: (mode: boolean) => void;

  // History tracking (Undo/Redo)
  past: ResumeData[];
  future: ResumeData[];
  commit: () => void;
  undo: () => void;
  redo: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  data: initialResumeData,
  themeConfig: {
    accentColor: '#000000',
    fontFamily: 'serif',
  },
  setThemeConfig: (config) => set((state) => ({ themeConfig: { ...state.themeConfig, ...config } })),

  activeAccordion: 'summary',
  setActiveAccordion: (accordion) => set({ activeAccordion: accordion }),


  careerGrade: 'Fresher',
  isEditing: false,
  setIsEditing: (isEditing) => set({ isEditing }),
  atsViewMode: false,
  setAtsViewMode: (mode) => set({ atsViewMode: mode }),
  setCareerGrade: (grade) => set({ careerGrade: grade }),
  activeAiEditField: null,
  setActiveAiEditField: (field) => set({ activeAiEditField: field }),

  targetJobKeywords: '',
  setTargetJobKeywords: (keywords) => set({ targetJobKeywords: keywords }),
  targetJobDescription: '',
  setTargetJobDescription: (jd) => set({ targetJobDescription: jd }),

  past: [],
  future: [],
  commit: () => set((state) => {
    // Only commit if data actually changed
    if (state.past.length > 0 && JSON.stringify(state.past[state.past.length - 1]) === JSON.stringify(state.data)) {
      return state;
    }
    return {
      past: [...state.past, JSON.parse(JSON.stringify(state.data))],
      future: []
    };
  }),
  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      data: previous,
      past: newPast,
      future: [JSON.parse(JSON.stringify(state.data)), ...state.future]
    };
  }),
  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      data: next,
      past: [...state.past, JSON.parse(JSON.stringify(state.data))],
      future: newFuture
    };
  }),
  updatePersonalInfo: (info) =>
    set((state) => {
      state.commit();
      return {
        data: {
          ...state.data,
          personalInfo: { ...state.data.personalInfo, ...info },
        },
      };
    }),
  addExperience: (exp) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, experience: [...state.data.experience, exp] } };
    }),
  updateExperience: (id, updatedExp) =>
    set((state) => {
      state.commit();
      return {
        data: {
          ...state.data,
          experience: state.data.experience.map((exp) =>
            exp.id === id ? { ...exp, ...updatedExp } : exp
          ),
        },
      };
    }),
  removeExperience: (id) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, experience: state.data.experience.filter((exp) => exp.id !== id) } };
    }),
  addEducation: (edu) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, education: [...state.data.education, edu] } };
    }),
  updateEducation: (id, updatedEdu) =>
    set((state) => {
      state.commit();
      return {
        data: {
          ...state.data,
          education: state.data.education.map((edu) =>
            edu.id === id ? { ...edu, ...updatedEdu } : edu
          ),
        },
      };
    }),
  removeEducation: (id) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, education: state.data.education.filter((edu) => edu.id !== id) } };
    }),
  addSkill: (skill) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, skills: [...state.data.skills, skill] } };
    }),
  updateSkill: (id, updatedSkill) =>
    set((state) => {
      state.commit();
      return {
        data: {
          ...state.data,
          skills: state.data.skills.map((skill) =>
            skill.id === id ? { ...skill, ...updatedSkill } : skill
          ),
        },
      };
    }),
  removeSkill: (id) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, skills: state.data.skills.filter((skill) => skill.id !== id) } };
    }),
  addProject: (project) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, projects: [...state.data.projects, project] } };
    }),
  updateProject: (id, updatedProject) =>
    set((state) => {
      state.commit();
      return {
        data: {
          ...state.data,
          projects: state.data.projects.map((project) =>
            project.id === id ? { ...project, ...updatedProject } : project
          ),
        },
      };
    }),
  removeProject: (id) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, projects: state.data.projects.filter((project) => project.id !== id) } };
    }),
  setSectionOrder: (order) =>
    set((state) => {
      state.commit();
      return { data: { ...state.data, sectionOrder: order } };
    }),
  setResumeData: (data) => set((state) => {
    state.commit();
    return { 
      data: {
        ...data,
        personalInfo: data.personalInfo || { fullName: '', email: '', phone: '', location: '', summary: '' },
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        projects: data.projects || [],
        achievements: data.achievements || [],
        responsibilities: data.responsibilities || [],
        sectionOrder: data.sectionOrder || initialResumeData.sectionOrder,
      } 
    };
  }),
  sanitizeData: () => set((state) => {
    const newData = { ...state.data };

    newData.experience = (newData.experience || []).map(exp => ({
      ...exp,
      description: (exp.description || []).map(d => sanitizeText(d))
    }));

    newData.projects = (newData.projects || []).map(proj => ({
      ...proj,
      description: (proj.description || []).map(d => sanitizeText(d)),
      technologies: (proj.technologies || []).map(t => sanitizeText(t))
    }));

    newData.skills = (newData.skills || []).map(skill => ({
      ...skill,
      items: (skill.items || []).map(s => sanitizeText(s))
    }));

    return { data: newData };
  }),
}));

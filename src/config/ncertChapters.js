// NCERT Chapters — Class 9-12
export const NCERT_CHAPTERS = {
  physics: {
    '11': [
      'Units and Measurements', 'Motion in a Straight Line',
      'Motion in a Plane', 'Laws of Motion', 'Work Energy and Power',
      'System of Particles and Rotational Motion', 'Gravitation',
      'Mechanical Properties of Solids', 'Mechanical Properties of Fluids',
      'Thermal Properties of Matter', 'Thermodynamics',
      'Kinetic Theory', 'Oscillations', 'Waves',
    ],
    '12': [
      'Electric Charges and Fields', 'Electrostatic Potential and Capacitance',
      'Current Electricity', 'Moving Charges and Magnetism',
      'Magnetism and Matter', 'Electromagnetic Induction',
      'Alternating Current', 'Electromagnetic Waves', 'Ray Optics',
      'Wave Optics', 'Dual Nature of Radiation and Matter', 'Atoms',
      'Nuclei', 'Semiconductor Electronics',
    ],
  },
  chemistry: {
    '11': [
      'Some Basic Concepts of Chemistry', 'Structure of Atom',
      'Classification of Elements', 'Chemical Bonding',
      'Thermodynamics', 'Equilibrium', 'Redox Reactions',
      'Organic Chemistry Basics', 'Hydrocarbons',
      'p-Block Elements', 's-Block Elements',
    ],
    '12': [
      'Solutions', 'Electrochemistry', 'Chemical Kinetics',
      'd and f Block Elements', 'Coordination Compounds',
      'Haloalkanes and Haloarenes', 'Alcohols Phenols Ethers',
      'Aldehydes Ketones Carboxylic Acids', 'Amines',
      'Biomolecules',
    ],
  },
  math: {
    '11': [
      'Sets', 'Relations and Functions', 'Trigonometric Functions',
      'Principle of Mathematical Induction', 'Complex Numbers',
      'Linear Inequalities', 'Permutations and Combinations',
      'Binomial Theorem', 'Sequences and Series',
      'Straight Lines', 'Conic Sections', 'Introduction to 3D Geometry',
      'Limits and Derivatives', 'Mathematical Reasoning',
      'Statistics', 'Probability',
    ],
    '12': [
      'Relations and Functions', 'Inverse Trigonometric Functions',
      'Matrices', 'Determinants', 'Continuity and Differentiability',
      'Application of Derivatives', 'Integrals',
      'Application of Integrals', 'Differential Equations',
      'Vector Algebra', 'Three Dimensional Geometry',
      'Linear Programming', 'Probability',
    ],
  },
  biology: {
    '11': [
      'The Living World', 'Biological Classification', 'Plant Kingdom',
      'Animal Kingdom', 'Morphology of Flowering Plants',
      'Anatomy of Flowering Plants', 'Structural Organisation in Animals',
      'Cell The Unit of Life', 'Biomolecules', 'Cell Cycle and Cell Division',
      'Photosynthesis', 'Respiration in Plants',
      'Plant Growth and Development', 'Digestion and Absorption',
      'Breathing and Exchange of Gases', 'Body Fluids and Circulation',
      'Excretory Products', 'Locomotion and Movement',
      'Neural Control', 'Chemical Coordination',
    ],
    '12': [
      'Reproduction in Organisms', 'Sexual Reproduction in Flowering Plants',
      'Human Reproduction', 'Reproductive Health',
      'Principles of Inheritance', 'Molecular Basis of Inheritance',
      'Evolution', 'Human Health and Disease',
      'Strategies for Enhancement in Food Production',
      'Microbes in Human Welfare', 'Biotechnology Principles',
      'Biotechnology Applications', 'Ecosystem',
      'Biodiversity and Conservation',
    ],
  },
  science: {
    '9': [
      'Matter in Our Surroundings', 'Is Matter Around Us Pure',
      'Atoms and Molecules', 'Structure of the Atom',
      'The Fundamental Unit of Life', 'Tissues',
      'Diversity in Living Organisms', 'Motion', 'Force and Laws of Motion',
      'Gravitation', 'Work and Energy', 'Sound',
      'Why Do We Fall Ill', 'Natural Resources', 'Improvement in Food Resources',
    ],
    '10': [
      'Chemical Reactions and Equations', 'Acids Bases and Salts',
      'Metals and Non-metals', 'Carbon and its Compounds',
      'Periodic Classification', 'Life Processes', 'Control and Coordination',
      'How do Organisms Reproduce', 'Heredity and Evolution',
      'Light Reflection and Refraction', 'Human Eye',
      'Electricity', 'Magnetic Effects of Electric Current',
      'Sources of Energy', 'Our Environment',
    ],
  },
  math: {
    '9': [
      'Number Systems', 'Polynomials', 'Coordinate Geometry',
      'Linear Equations in Two Variables', 'Introduction to Euclid Geometry',
      'Lines and Angles', 'Triangles', 'Quadrilaterals',
      'Areas of Parallelograms', 'Circles', 'Constructions',
      'Heron Formula', 'Surface Areas and Volumes', 'Statistics', 'Probability',
    ],
    '10': [
      'Real Numbers', 'Polynomials', 'Pair of Linear Equations',
      'Quadratic Equations', 'Arithmetic Progressions', 'Triangles',
      'Coordinate Geometry', 'Introduction to Trigonometry',
      'Some Applications of Trigonometry', 'Circles', 'Constructions',
      'Areas Related to Circles', 'Surface Areas and Volumes',
      'Statistics', 'Probability',
    ],
  },
};

export function getChapters(subject, classId) {
  const subj = String(subject || '').toLowerCase();
  return NCERT_CHAPTERS[subj]?.[String(classId)] || [];
}

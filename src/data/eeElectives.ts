/** EE electrical electives — ece.rutgers.edu/electrical-electives */

import type { ElectiveOption } from "./electives";
import { technicalElectives } from "./electives";

export const electricalElectives: ElectiveOption[] = [
  { id: "ece-322", code: "14:332:322", title: "Principles of Communication Systems", kind: "restricted", credits: 3, offered: "spring" },
  { id: "ece-351-ee", code: "14:332:351", title: "Programming Methodology II", kind: "restricted", credits: 3, offered: "fall", note: "01:198:112 may substitute" },
  { id: "ece-376", code: "14:332:376", title: "Virtual Reality", kind: "restricted", credits: 3, offered: "spring", note: "14:332:378 co-req" },
  { id: "ece-382", code: "14:332:382", title: "Electromagnetic Fields", kind: "restricted", credits: 3, offered: "spring" },
  { id: "ece-402", code: "14:332:402", title: "Sustainable Energy", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-411", code: "14:332:411", title: "Electrical Energy Conversion", kind: "restricted", credits: 3 },
  { id: "ece-415", code: "14:332:415", title: "Introduction to Automatic Control Theory", kind: "restricted", credits: 3 },
  { id: "ece-417", code: "14:332:417", title: "Control System Design", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-421", code: "14:332:421", title: "Wireless Communication Systems", kind: "restricted", credits: 3, prereqs: ["14:332:322"], offered: "fall" },
  { id: "ece-423", code: "14:332:423", title: "Computer and Communication Networks", kind: "restricted", credits: 3, offered: "spring" },
  { id: "ece-424", code: "14:332:424", title: "Introduction to Information and Network Security", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-427", code: "14:332:427", title: "Communication System Design", kind: "restricted", credits: 3 },
  { id: "ece-434-ee", code: "14:332:434", title: "Introduction to Computer Systems", kind: "restricted", credits: 3, offered: "spring" },
  { id: "ece-435", code: "14:332:435", title: "Topics in ECE", kind: "restricted", credits: 3, offered: "both" },
  { id: "ece-436", code: "14:332:436", title: "Topics in ECE", kind: "restricted", credits: 3, offered: "both" },
  { id: "ece-437-ee", code: "14:332:437", title: "Digital Systems Design", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-445", code: "14:332:445", title: "Topics in ECE", kind: "restricted", credits: 3, offered: "both" },
  { id: "ece-446", code: "14:332:446", title: "Topics in ECE", kind: "restricted", credits: 3, offered: "both" },
  { id: "ece-447", code: "14:332:447", title: "Digital Signal Processing Design", kind: "restricted", credits: 3 },
  { id: "ece-451", code: "14:332:451", title: "Introduction to Parallel and Distributed Programming", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-452-ee", code: "14:332:452", title: "Software Engineering", kind: "restricted", credits: 3, offered: "spring" },
  { id: "ece-453", code: "14:332:453", title: "Mobile App Engineering and User Experience", kind: "restricted", credits: 3 },
  { id: "ece-456", code: "14:332:456", title: "Network-Centric Programming", kind: "restricted", credits: 3, offered: "spring" },
  { id: "ece-460", code: "14:332:460", title: "Power Electronics", kind: "restricted", credits: 3 },
  { id: "ece-463", code: "14:332:463", title: "Analog Electronics", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-464", code: "14:332:464", title: "RF Integrated Circuits", kind: "restricted", credits: 3 },
  { id: "ece-465", code: "14:332:465", title: "Physical Electronics", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-466", code: "14:332:466", title: "Opto-Electronic Devices", kind: "restricted", credits: 3 },
  { id: "ece-467", code: "14:332:467", title: "Microelectronic Processing", kind: "restricted", credits: 3 },
  { id: "ece-472", code: "14:332:472", title: "Robotics and Computer Vision", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-474", code: "14:332:474", title: "Intro to Computer Graphics", kind: "restricted", credits: 3 },
  { id: "ece-479", code: "14:332:479", title: "VLSI Design", kind: "restricted", credits: 3, offered: "fall" },
  { id: "ece-481", code: "14:332:481", title: "Electromagnetic Waves", kind: "restricted", credits: 3 },
  { id: "ece-482", code: "14:332:482", title: "Deep Submicron VLSI Design", kind: "restricted", credits: 3 },
  { id: "ece-491", code: "14:332:491", title: "Special Problems / Independent Study", kind: "restricted", credits: 3, offered: "both" },
  { id: "ece-493", code: "14:332:493", title: "Topics in ECE", kind: "restricted", credits: 3, offered: "both" },
  { id: "ece-494", code: "14:332:494", title: "Topics in ECE", kind: "restricted", credits: 3, offered: "both" },
];

export { technicalElectives as eeTechnicalElectives };

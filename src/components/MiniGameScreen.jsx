import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Viewer } from 'mapillary-js';
import '../assets/loader.css'

console.log("past import statements");
const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;
console.log("MAPILLARY_TOKEN:", !!MAPILLARY_TOKEN);


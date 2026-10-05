const CDN = 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/backend/compressed'
const PX = 'https://cdn.pixelbin.io/v2/jmd-asp/original/ResQImages'

export const mainAppliances = [
  { name: 'Air Conditioner', img: `${PX}/01.png`, slug: 'air-conditioner' },
  { name: 'Washing Machine', img: `https://cdn.pixelbin.io/v2/jmd-asp/original/ResQImages/09.png`, slug: 'washing-machine' },
  { name: 'Water Purifier', img: `${CDN}/15.webp`, slug: 'water-purifier' },
  { name: 'Refrigerator', img: `${CDN}/05.webp`, slug: 'refrigerator' },
  { name: 'LED TV', img: `${CDN}/04.webp`, slug: 'led-tv' },
  { name: 'Air Cooler', img: `${CDN}/03.webp`, slug: 'air-cooler' },
]

const BANNER = 'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images'

export const offerBanners = [
  { img: `${BANNER}/resQBanner_summer_13Apr26.webp`, label: 'Summer Offer', price: '₹119' },
  { img: `${BANNER}/resQBanner_AC_13Apr26.webp`, label: 'AC Service', price: '₹599' },
  { img: `${BANNER}/resQBanner_WM_13Apr26.webp`, label: 'Washing Machine', price: '₹239' },
  { img: `${BANNER}/resQBanner_TV_13Apr26.webp`, label: 'LED TV', price: '₹249' },
]

export const maintenanceServices = [
  { name: 'Split AC Jet Service', price: '₹599', marketPrice: '₹999', savings: '₹400', img: `${CDN}/splite_ac_Split_AC_Jet_Service.webp`, badge: '2 booked recently', desc: 'High-pressure jet wash removes dust, bacteria and debris from the indoor unit, coils and filters — restoring your AC\'s cooling efficiency and air quality.', includes: ['Indoor unit high-pressure wash', 'Filter deep clean & dry', 'Coil cleaning', 'Drain tray check', 'Performance test after service'] },
  { name: 'Split AC Dry Service', price: '₹249', marketPrice: '₹450', savings: '₹201', img: `${CDN}/splite_ac_Split_AC_Dry_Service.webp`, badge: '1 booked recently', desc: 'Dry cleaning of the AC filters, coils and outdoor unit using brushes and compressed air — ideal for regular upkeep without water.', includes: ['Filter dry cleaning', 'Coil brush clean', 'Outdoor unit dust removal', 'Gas level check', 'Cooling performance test'] },
  { name: 'Air Cooler Cleaning Service', price: '₹309', marketPrice: '₹500', savings: '₹191', img: `${CDN}/AirCooler_maintain.webp`, badge: '1 booked recently', desc: 'Tank, cooling pads, motor and blower cleaned to clear algae, dust and odour for stronger, fresher airflow.', includes: ['Water tank clean & sanitise', 'Cooling pad wash', 'Blower & motor dust removal', 'Fan speed check', 'Anti-algae treatment'] },
  { name: 'Water Purifier Service with filter', price: '₹309', marketPrice: '₹500', savings: '₹191', img: `${CDN}/Water_Purifier_Water_Purifier_Service_with_Filter_(Parts_Extra).webp`, badge: '', desc: 'Complete inspection and service of your water purifier including filter check, membrane inspection and sanitisation.', includes: ['Filter condition check', 'Membrane inspection', 'Tank sanitisation', 'Flow rate test', 'TDS level verification'] },
  { name: 'Front Load WM Cleaning Service', price: '₹189', marketPrice: '₹350', savings: '₹161', img: `${CDN}/front_Load_Washing_Machine_washing_machine_front_load_filter_clean.webp`, badge: '', desc: 'Full drum clean, rubber seal wash and detergent drawer descaling to remove mould, limescale and bad odours.', includes: ['Drum clean cycle', 'Rubber seal mould removal', 'Detergent drawer descale', 'Filter clean', 'Drain pipe check'] },
  { name: 'Top Load WM Cleaning Service', price: '₹189', marketPrice: '₹350', savings: '₹161', img: `${CDN}/TopLoadCleaning.webp`, badge: '', desc: 'Deep clean of the drum, agitator, lid seal and dispenser to remove detergent buildup and bacteria.', includes: ['Drum sanitisation', 'Agitator clean', 'Lid seal wipe', 'Dispenser descale', 'Drain filter clean'] },
  { name: 'Double Door Refrigerator Cleaning', price: '₹189', marketPrice: '₹300', savings: '₹111', img: `${CDN}/DoubleDoorRefCleaning.webp`, badge: '', desc: 'Interior and exterior cleaning, coil dusting and drain tray sanitisation to keep your fridge hygienic.', includes: ['Interior shelf & drawer clean', 'Coil dusting', 'Door seal check', 'Drain tray sanitise', 'Temperature test'] },
  { name: 'LED TV 40–55 inch Cleaning', price: '₹189', marketPrice: '₹300', savings: '₹111', img: `${CDN}/TV_Tv_cleanning_copy.webp`, badge: '', desc: 'Professional screen, bezel and rear panel cleaning using anti-static cloths and screen-safe solution.', includes: ['Screen anti-static clean', 'Bezel & port clean', 'Rear panel dust removal', 'Stand clean', 'Remote clean'] },
]

export const installationServices = [
  { name: 'Split AC Installation', price: '₹1,419', img: `${CDN}/splite_ac_Split_AC_Installation.webp`, badge: '', desc: 'Professional installation of your split AC including mounting, piping, electrical connections and gas charging.', includes: ['Indoor & outdoor unit mounting', 'Copper piping (up to 3m)', 'Electrical connection', 'Gas charging', 'Trial run & handover'] },
  { name: 'Window AC Installation', price: '₹589', img: `${CDN}/AC_Window_AC_Installation.webp`, badge: '', desc: 'Complete window AC installation with proper sealing, electrical connections and performance verification.', includes: ['Unit mounting in window', 'Proper sealing & fitting', 'Electrical connection', 'Drainage setup', 'Performance test'] },
  { name: 'LED TV 55+ inch Installation', price: '₹829', img: `${CDN}/TV_TV_installation.webp`, badge: '', desc: 'Safe wall mounting of large LED TVs with cable management and optimal viewing angle adjustment.', includes: ['Wall bracket installation', 'Cable management', 'Optimal tilt & angle setup', 'HDMI & cable connection', 'Picture calibration check'] },
  { name: 'Front Load WM Installation', price: '₹409', img: `${CDN}/front_Load_Washing_Machine_washing_machine_installation_.webp`, badge: '', desc: 'Level installation of your front-load washing machine with inlet/outlet pipe connections and a trial wash run.', includes: ['Level positioning', 'Inlet pipe connection', 'Outlet pipe setup', 'Trial wash run', 'Drum protection bolt removal'] },
  { name: 'Water Purifier Installation', price: '₹469', img: `${CDN}/Water_Purifier_Water_Purifier_Installation.webp`, badge: '', desc: 'Complete installation of your water purifier with tap connection, tank filling and water quality verification.', includes: ['Wall/counter mounting', 'Tap & inlet connection', 'Tank fill & flush', 'TDS level check', 'Usage demo'] },
  { name: 'Air Cooler Installation', price: '₹159', img: `${CDN}/AirCooler_Installation.webp`, badge: '', desc: 'Quick setup and positioning of your air cooler with water connection and performance test.', includes: ['Positioning & levelling', 'Water connection', 'Pad alignment check', 'Fan speed test', 'Usage tips'] },
  { name: 'Side By Side Fridge Installation', price: '₹589', img: `${CDN}/SideBySideDoorFridgeInstallation.webp`, badge: '', desc: 'Careful installation and levelling of your side-by-side refrigerator with door alignment and icemaker setup.', includes: ['Level positioning', 'Door alignment', 'Water line connection', 'Icemaker setup', 'Temperature calibration'] },
  { name: 'Double Door Fridge Installation', price: '₹479', img: `${CDN}/DoubleDoorInstallation.webp`, badge: '', desc: 'Professional installation of double door fridge with levelling, door hinge check and temperature verification.', includes: ['Level positioning', 'Door hinge check', 'Temperature calibration', 'Drawer & shelf setup', 'Trial run'] },
]

export const allAppliances = [
  { name: 'Air Conditioner', img: `${PX}/01.png` },
  { name: 'Air Cooler', img: `${CDN}/03.webp` },
  { name: 'Air Purifier', img: `${CDN}/13.webp` },
  { name: 'Desktops', img: `${CDN}/FINAL_CDIT-11_Desktops.webp` },
  { name: 'Dishwasher', img: `${CDN}/08.webp` },
  { name: 'Fans', img: `${PX}/25.png` },
  { name: 'Food Processor', img: `${CDN}/FINAL_CDIT-02.webp` },
  { name: 'Gas Stove', img: `${CDN}/FINAL_CDIT-01.webp` },
  { name: 'Geyser', img: `${CDN}/14.webp` },
  { name: 'Hobs & Chimneys', img: `${PX}/20.png` },
  { name: 'Induction Cooktop', img: `${CDN}/FINAL_CDIT-04.webp` },
  { name: 'Laptops', img: `${CDN}/FINAL_CDIT-09_Laptops.webp` },
  { name: 'LED TV', img: `${CDN}/04.webp` },
  { name: 'Microwave Ovens', img: `${CDN}/19.webp` },
  { name: 'Mixer Grinder', img: `${CDN}/FINAL_CDIT-05.webp` },
  { name: 'OTG', img: `${PX}/17.png` },
  { name: 'Printers', img: `${CDN}/FINAL_CDIT-13_Printers.webp` },
  { name: 'Refrigerator', img: `${CDN}/05.webp` },
  { name: 'Tablets', img: `${CDN}/FINAL_CDIT-12_Tablets.webp` },
  { name: 'Vacuum Cleaner', img: `${CDN}/FINAL_CDIT-03.webp` },
  { name: 'Washing Machine', img: `${PX}/09.png` },
  { name: 'Water Purifier', img: `${CDN}/15.webp` },
]

export const testimonialVideos = [
  'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/testimonialVideo.mp4',
  'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/testimonialTwo.mp4',
  'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/testimonialThree.mp4',
  'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/testimonialFour.mp4',
  'https://myjiostatic.cdn.jio.com/JPW/CDIT_Consumer/images/testimonialFive.mp4',
]

export const allServices = [...maintenanceServices, ...installationServices]

export function getServiceBySlug(slug) {
  return allServices.find(s => slugify(s.name) === slug)
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

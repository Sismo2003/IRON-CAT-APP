import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import {
	ChevronsLeft,
	ChevronsRight,
	LogOut,
	User2,
	Settings,
	OctagonPause,
	RotateCcw,
	Power
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';


import icon_bk from "assets/images/iron-cat-logo-tmp-svg/black_icon.png";
import icon_wh from "assets/images/iron-cat-logo-tmp-svg/white_icon.png";

import logo_bk from "assets/images/iron-cat-logo-tmp-svg/black_logo.png";
import logo_wh from "assets/images/iron-cat-logo-tmp-svg/white_logo.png";

import nimbus_cloud_logo_wh from "assets/images/nimbus-cloud/logo_nimbus_cloud_white.png"; // Ajusta la ruta
import nimbus_cloud_logo_bk from "assets/images/nimbus-cloud/logo_nimbus_cloud_black.png";

//import components
import LanguageDropdown from 'Common/LanguageDropdown';
import LightDark from 'Common/LightDark';
import { Dropdown } from 'Common/Components/Dropdown';
import { changeLeftsidebarSizeType } from 'slices/thunk';
// import {toast} from "react-toastify";


function obtenerSaludo(): string {
	const hora = new Date().getHours();
	
	if (hora >= 6 && hora < 12) {
		return "¡Buenos días!";
	} else if (hora >= 12 && hora < 18) {
		return "¡Buenas tardes!";
	} else {
		return "¡Buenas noches!";
	}
}



const ENV_MODE : any = process.env.REACT_APP_MODE;
const PRINTER_ROUTE_DEV : any = process.env.REACT_APP_PRINTER_DEV;
const PRINTER_ROUTE_PROD : any = process.env.REACT_APP_PRINTER_PROD;


const Header = ({ handleToggleDrawer, handleDrawer }: any) => {
	let authUser: any = JSON.parse(localStorage.getItem('authUser') || '{}');
	const dispatch = useDispatch<any>();
	
	// react-redux
	const selectLayoutState = (state: any) => state.Layout;
	const selectLayoutProperties = createSelector(
		selectLayoutState,
		(layout: any) => ({
			layoutSidebarSizeType: layout.layoutSidebarSizeType,
			layoutType: layout.layoutType,
		})
	);
	
	const { layoutSidebarSizeType, layoutType } = useSelector(selectLayoutProperties);
	
	const handleTopbarHamburgerIcon = () => {
		var windowSize = document.documentElement.clientWidth;
		let sidebarOverlay = document.getElementById("sidebar-overlay") as any;
		
		
		if (windowSize < 768) {
			document.body.classList.add("overflow-hidden");
			if (sidebarOverlay.classList.contains("hidden")) {
				sidebarOverlay.classList.remove("hidden");
				(document as Document | any).querySelector(".app-menu").classList.remove("hidden");
			} else {
				sidebarOverlay.classList.add("hidden");
				(document as Document | any).querySelector(".app-menu").classList.add("hidden");
			}
			dispatch(changeLeftsidebarSizeType("lg"));
		} else {
			dispatch(changeLeftsidebarSizeType(layoutSidebarSizeType === "sm" ? "lg" : "sm"));
		}
	}
	
	useEffect(() => {
		// resize
		const handleResizeLayout = () => {
			var windowSize = document.documentElement.clientWidth;
			
			if (windowSize < 768) {
				dispatch(changeLeftsidebarSizeType("lg"));
			} else if (windowSize <= 1024) {
				if (layoutType === "vertical") {
					dispatch(changeLeftsidebarSizeType("sm"));
				} else {
					dispatch(changeLeftsidebarSizeType("lg"));
				}
			} else {
				dispatch(changeLeftsidebarSizeType("lg"));
				
				// dispatch(changeLeftsidebarSizeType(layoutSidebarSizeType === "sm" ? "lg" : "sm"));
			}
		}
		
		// out side click
		const outerSideElement = () => {
			var windowSize = document.documentElement.clientWidth;
			var sidebarOverlay = document.getElementById("sidebar-overlay") as any;
			if (sidebarOverlay) {
				sidebarOverlay.addEventListener("click", () => {
					if (!sidebarOverlay.classList.contains("hidden")) {
						
						if (windowSize <= 768) {
							document?.querySelector(".app-menu")?.classList.add("hidden");
							document.body.classList.remove("overflow-hidden");
							sidebarOverlay.classList.add("hidden");
						} else {
							dispatch(changeLeftsidebarSizeType("lg"));
						}
					}
				});
			}
		}
		
		// scroll
		const scrollNavigation = () => {
			var scrollUp = document.documentElement.scrollTop;
			if (scrollUp >= 50) {
				document.getElementById("page-topbar")?.classList.add('is-sticky');
			} else {
				document.getElementById("page-topbar")?.classList.remove('is-sticky');
			}
		};
		
		window.addEventListener('scroll', scrollNavigation, true);
		window.addEventListener("click", outerSideElement);
		window.addEventListener("resize", handleResizeLayout);
		
		// Cleanup function to remove the event listeners
		return () => {
			window.removeEventListener('scroll', scrollNavigation, true);
			window.removeEventListener("click", outerSideElement);
			window.removeEventListener("resize", handleResizeLayout);
		};
	}, [layoutType, dispatch]);
	
	
	
const scaleService = (action: string) => {
	let caso : string;
	switch (action) {
		case "stop":
			caso = "detener las basculas";
			break;
		case "start":
			caso = "encender las basculas";
			break;
		case "restart":
			caso = "reiniciar las basculas";
			break;
		default:
			caso = "INDEFINIDO";
			return;
	}
	
	
  Swal.fire({
    title: '¿Estás seguro?',
    text: `Estás a punto de : ${caso}, tendrás que esperar unos segundos para que la acción se complete.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      let route: string = ENV_MODE === 'production' ? PRINTER_ROUTE_PROD : PRINTER_ROUTE_DEV;
      route += '/src/valves_controller/main.php';
			console.log("Basculas servicio accion: ",action);
      fetch(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
				body: JSON.stringify({ action: action })
      })
      .then(res => res.json())
      .then(data => {
        if (data.status) {
          Swal.fire('Completado', 'La acción se ejecutó correctamente.', 'success');
        } else {
          Swal.fire('Error', 'La acción no se completó correctamente.', 'error');
        }
      })
      .catch(err => {
        Swal.fire('Error', 'Ocurrió un error al ejecutar la acción.', 'error');
      });
    }
  });
};
	
	
	
	return (
		<React.Fragment>
			<header id="page-topbar" className="ltr:md:left-vertical-menu rtl:md:right-vertical-menu group-data-[sidebar-size=md]:ltr:md:left-vertical-menu-md group-data-[sidebar-size=md]:rtl:md:right-vertical-menu-md group-data-[sidebar-size=sm]:ltr:md:left-vertical-menu-sm group-data-[sidebar-size=sm]:rtl:md:right-vertical-menu-sm group-data-[layout=horizontal]:ltr:left-0 group-data-[layout=horizontal]:rtl:right-0 fixed right-0 z-[1000] left-0 print:hidden group-data-[navbar=bordered]:m-4 group-data-[navbar=bordered]:[&.is-sticky]:mt-0 transition-all ease-linear duration-300 group-data-[navbar=hidden]:hidden group-data-[navbar=scroll]:absolute group/topbar group-data-[layout=horizontal]:z-[1004]">
				<div className="layout-width">
					<div className="flex items-center px-4 mx-auto bg-topbar border-b-2 border-topbar group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-brand shadow-md h-header shadow-slate-200/50 group-data-[navbar=bordered]:rounded-md group-data-[navbar=bordered]:group-[.is-sticky]/topbar:rounded-t-none group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:border-zink-700 dark:shadow-none group-data-[topbar=dark]:group-[.is-sticky]/topbar:dark:shadow-zink-500 group-data-[topbar=dark]:group-[.is-sticky]/topbar:dark:shadow-md group-data-[navbar=bordered]:shadow-none group-data-[layout=horizontal]:group-data-[navbar=bordered]:rounded-b-none group-data-[layout=horizontal]:shadow-none group-data-[layout=horizontal]:dark:group-[.is-sticky]/topbar:shadow-none">
						<div className="flex items-center w-full group-data-[layout=horizontal]:mx-auto group-data-[layout=horizontal]:max-w-screen-2xl navbar-header group-data-[layout=horizontal]:ltr:xl:pr-3 group-data-[layout=horizontal]:rtl:xl:pl-3">
							
							<div className="items-center justify-center hidden px-5 text-center h-header group-data-[layout=horizontal]:md:flex group-data-[layout=horizontal]:ltr::pl-0 group-data-[layout=horizontal]:rtl:pr-0">
								
								<Link to="/">
									<span className="hidden">
										<img src={icon_bk} alt="" className="h-10" />
									</span>
														<span className="group-data-[topbar=dark]:hidden group-data-[topbar=brand]:hidden">
										<img src={logo_bk} alt="" className="h-6 mx-auto" />
									</span>
													</Link>
													
													<Link to="/" className="hidden group-data-[topbar=dark]:block group-data-[topbar=brand]:block">
									<span className="group-data-[topbar=dark]:hidden group-data-[topbar=brand]:hidden">
										<img src={logo_wh} alt="" className="h-6 mx-auto" />
									</span>
														<span className="group-data-[topbar=dark]:block group-data-[topbar=brand]:block">
										<img src={icon_wh} alt="" className="h-6 mx-auto" />
									</span>
								</Link>
							</div>
							
							<button onClick={handleTopbarHamburgerIcon} type="button" className="inline-flex relative justify-center items-center p-0 text-topbar-item transition-all size-[37.5px] duration-75 ease-linear bg-topbar rounded-md btn hover:bg-slate-100 group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:border-topbar-dark group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:border-topbar-brand group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:text-zink-200 group-data-[topbar=dark]:dark:border-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[layout=horizontal]:flex group-data-[layout=horizontal]:md:hidden hamburger-icon" id="topnav-hamburger-icon">
								<ChevronsLeft className="w-5 h-5 group-data-[sidebar-size=sm]:hidden" />
								<ChevronsRight className="hidden w-5 h-5 group-data-[sidebar-size=sm]:block" />
							</button>
							
							<div className="flex items-center gap-1.5">
								<Link to="/">
									<span className="flex group-data-[topbar=dark]:hidden group-data-[topbar=brand]:hidden">
										<img src={nimbus_cloud_logo_bk} alt="" className="h-7 md:h-10 mx-auto" />
										
									</span>
														
									<span className="hidden group-data-[topbar=dark]:flex group-data-[topbar=brand]:block">
										<img src={nimbus_cloud_logo_wh} alt="" className="h-7 md:h-10 mx-auto" />
									</span>
								</Link>
							</div>
							
							<div className="flex gap-3 ms-auto">
								
								{/* LanguageDropdown */}
								<LanguageDropdown />
								
								{/* LightDark */}
								<LightDark />
								
								<div className="relative items-center hidden h-header md:flex">
									<button onClick={handleToggleDrawer} data-drawer-target="customizerButton" type="button" className="inline-flex justify-center items-center p-0 text-topbar-item transition-all size-[37.5px] duration-200 ease-linear bg-topbar group-data-[topbar=dark]:text-topbar-item-dark rounded-md btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[topbar=dark]:dark:text-zink-200">
										<Settings className="inline-block size-5 stroke-1 fill-slate-100 group-data-[topbar=dark]:fill-topbar-item-bg-hover-dark group-data-[topbar=brand]:fill-topbar-item-bg-hover-brand"></Settings>
									</button>
								</div>
								<Dropdown className="relative flex items-center h-header">
									<Dropdown.Trigger type="button" className="inline-block p-0 transition-all duration-200 ease-linear bg-topbar rounded-full text-topbar-item dropdown-toggle btn hover:bg-topbar-item-bg-hover hover:text-topbar-item-hover group-data-[topbar=dark]:text-topbar-item-dark group-data-[topbar=dark]:bg-topbar-dark group-data-[topbar=dark]:hover:bg-topbar-item-bg-hover-dark group-data-[topbar=dark]:hover:text-topbar-item-hover-dark group-data-[topbar=brand]:bg-topbar-brand group-data-[topbar=brand]:hover:bg-topbar-item-bg-hover-brand group-data-[topbar=brand]:hover:text-topbar-item-hover-brand group-data-[topbar=dark]:dark:bg-zink-700 group-data-[topbar=dark]:dark:hover:bg-zink-600 group-data-[topbar=brand]:text-topbar-item-brand group-data-[topbar=dark]:dark:hover:text-zink-50 group-data-[topbar=dark]:dark:text-zink-200" id="dropdownMenuButton" data-bs-toggle="dropdown">
										<div className="bg-pink-100 rounded-full">
											<img src={authUser.img} alt="" className="size-[37.5px] rounded-full" />
										</div>
									</Dropdown.Trigger>
									<Dropdown.Content placement="right-end" className="absolute z-50 p-4 ltr:text-left rtl:text-right bg-white rounded-md shadow-md !top-4 dropdown-menu min-w-[14rem] dark:bg-zink-600" aria-labelledby="dropdownMenuButton">
										<h6 className="mb-2 text-sm font-normal text-slate-500 dark:text-zink-300">{obtenerSaludo() }</h6>
										<a href="#!" className="flex gap-3 mb-3">
											<div className="relative inline-block shrink-0">
												<div className="rounded bg-slate-100 dark:bg-zink-500">
													<img src={authUser.img} alt="" className="size-12 rounded" />
												</div>
												<span className="-top-1 ltr:-right-1 rtl:-left-1 absolute size-2.5 bg-green-400 border-2 border-white rounded-full dark:border-zink-600"></span>
											</div>
											<div>
												<h6 className="mb-1 text-15">{authUser.name || "Usuario"}</h6>
												<p className="text-slate-500 dark:text-zink-300">{ authUser.role === 'admin' ? 'Administrador IRON-CAT' : 'Usuario IRON-CAT'}</p>
											</div>
										</a>
										<ul>
											<li>
												<Link className="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200 dark:hover:text-custom-500 dark:focus:text-custom-500"
															to={process.env.PUBLIC_URL + "/user-profile"}>
													<User2 className="inline-block size-4 ltr:mr-2 rtl:ml-2"></User2> Perfil
												</Link>
											</li>
											{/*START SERVICE FOR SCALES*/}
											<li onClick={() => {scaleService('start')}}>
												<Link className="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200 dark:hover:text-custom-500 dark:focus:text-custom-500"
															to={"#!"}>
													<Power  className="inline-block size-4 ltr:mr-2 rtl:ml-2"></Power> Encender Basculas
												</Link>
											</li>
											{/*RESTART SERVICE FOR SCALES*/}
											<li onClick={() => {scaleService('restart')}}>
												<Link
													className="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear
													 text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200
													 dark:hover:text-custom-500 dark:focus:text-custom-500"
													to={"#!"}>
													<RotateCcw
														className="inline-block size-4 ltr:mr-2 rtl:ml-2">
													</RotateCcw>
													Reiniciar Basculas
												</Link>
											</li>
											{/*STOP SERVICE FOR SCALES*/}
											<li onClick={() => {scaleService('stop')}}>
												<Link className="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200 dark:hover:text-custom-500 dark:focus:text-custom-500"
															to={"#!"}>
													<OctagonPause className="inline-block size-4 ltr:mr-2 rtl:ml-2"></OctagonPause> Detener Basculas
												</Link>
											</li>
										
											
											
											<li className="pt-2 mt-2 border-t border-slate-200 dark:border-zink-500">
												<a className="block ltr:pr-4 rtl:pl-4 py-1.5 text-base font-medium transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:text-custom-500 focus:text-custom-500 dark:text-zink-200 dark:hover:text-custom-500 dark:focus:text-custom-500"
													 href={process.env.PUBLIC_URL + "/logout"}>
													<LogOut className="inline-block size-4 ltr:mr-2 rtl:ml-2"></LogOut>
													Cerrar sesion
												</a>
											</li>
										</ul>
									</Dropdown.Content>
								</Dropdown>
							</div>
						</div>
					</div>
				</div>
			</header>
		</React.Fragment>
	);
};

export default Header;

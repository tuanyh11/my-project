import { Button, Flex, Link, } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
// import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	// const setAuthScreen = useSetRecoilState(authScreenAtom);
	// const bgCl = `${colorMode === "dark" ? "#03A9F4": "#03A9F4"}`;
	return (
		<Flex justifyContent={"space-between"} mt={6} mb='12'>
			{user && (
				<Link as={RouterLink} to='/'>
					<AiFillHome size={24} />
				</Link>
			)}
			{/* {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)} */}

			{/* <Image
				cursor={"pointer"}
				alt='logo'
				w={6}
				src={colorMode === "dark" ? "/logo.svg" : "/logo.svg"}
				onClick={toggleColorMode}
			/> */}
			
			{/* <div onClick={toggleColorMode} className="mode" style={{"--bg-cl": bgCl, "--txt-cl": "white"}} >
				<MdOutlineLightMode/>
			</div> */}

			{user && (
				<Flex alignItems={"center"} gap={{base: "1.5rem"}}>
					<Link as={RouterLink} to={`/${user.username}`}>
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to={`/chat`}>
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to={`/settings`}>
						<MdOutlineSettings size={20} />
					</Link>
					<Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
					</Button>
				</Flex>
			)}

			{/* {!user && (
				<Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)} */}
		</Flex>
	);
};

export default Header;

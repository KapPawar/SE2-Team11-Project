import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-5 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/logo-transparent-svg.svg"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>
        <p>Software Engineering 2 Project by Team 11</p>
      </div>
    </footer>
  );
};

export default Footer;

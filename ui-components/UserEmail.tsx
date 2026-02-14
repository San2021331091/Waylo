import React, {useEffect, useState} from "react";
import {supabase} from "@/supabase/SupabaseClient.ts";
import {Text} from "react-native";

const UserEmail:React.FC = ():React.JSX.Element => {
    const [email, setEmail] = useState<string|undefined>(" ");

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser();
            setEmail(data?.user?.email);
        };

        fetchUser().then();
    }, []);

    return (
        <Text className="text-white mt-2 text-lg font-semibold">
            {email}
        </Text>
    );
};

export default UserEmail;

